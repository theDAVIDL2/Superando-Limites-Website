import os
from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import httpx
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime

# New: Import mongomock for testing
from mongomock import MongoClient as MongoMockClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Use mongomock for testing if TESTING is set to true
if os.environ.get("TESTING") == "true":
    client = MongoMockClient()
    db = client.get_database(os.environ.get('DB_NAME', 'testdb'))
    def db_call(coro):
        return coro
else:
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    async def db_call(coro):
        return await coro

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
# Optional n8n webhook integration (env):
N8N_WEBHOOK_LEAD = os.environ.get("N8N_WEBHOOK_LEAD", "")
N8N_WEBHOOK_ORDER = os.environ.get("N8N_WEBHOOK_ORDER", "")
N8N_WEBHOOK_NEWSLETTER = os.environ.get("N8N_WEBHOOK_NEWSLETTER", "")

# Placeholder checkout integration (Yampi/Stripe/etc.)
CHECKOUT_PUBLIC_URL = os.environ.get("CHECKOUT_PUBLIC_URL", "")
CHECKOUT_PROVIDER = os.environ.get("CHECKOUT_PROVIDER", "yampi")

# Optional admin key (protects list endpoints if set)
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

# OpenRouter server-side config (for backend proxy)
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-oss-20b:free")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_API_KEYS = [k.strip() for k in os.environ.get("OPENROUTER_API_KEYS", "").replace(";", ",").split(",") if k.strip()] or ([OPENROUTER_API_KEY] if OPENROUTER_API_KEY else [])

async def emit_n8n(url: str, payload: dict):
    if not url:
        logger.warning("N8N emit skipped: empty URL for payload type=%s", payload.get("type"))
        return
    # fire-and-forget: do not block user flow, but log non-2xx responses
    try:
        async with httpx.AsyncClient(timeout=8.0) as client_http:
            resp = await client_http.post(url, json=payload)
            if resp.status_code < 200 or resp.status_code >= 300:
                body = None
                try:
                    body = resp.text[:500]
                except Exception:
                    body = "<unreadable>"
                logger.warning(
                    "N8N emit non-2xx: status=%s url=%s body=%s", resp.status_code, url, body
                )
            else:
                logger.info("N8N emit ok: type=%s status=%s", payload.get("type"), resp.status_code)
    except Exception as e:
        logger.warning("N8N emit failed: url=%s err=%s", url, str(e))


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# New: Leads
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeadCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = None

# New: Order Intents (mock of pre-checkout)
class OrderIntent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    price: float
    currency: str
    note: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderIntentCreate(BaseModel):
    price: float
    currency: str
    note: Optional[str] = None
    email: Optional[str] = None

class CheckoutStart(BaseModel):
    price: float
    currency: str
    email: Optional[EmailStr] = None
    note: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    stream: bool = True

# New: Newsletter subscribers
class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NewsletterCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = None


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db_call(db.status_checks.insert_one(status_obj.dict()))
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db_call(db.status_checks.find().to_list(1000))
    return [StatusCheck(**status_check) for status_check in status_checks]

# Leads endpoints
@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.dict())
    existing = await db_call(db.leads.find_one({"email": lead.email}))
    if existing:
        # idempotent upsert-like behavior: return existing as Lead
        return Lead(**existing)
    await db_call(db.leads.insert_one(lead.dict()))
    # forward to n8n (JSON-safe payload)
    await emit_n8n(N8N_WEBHOOK_LEAD, {"type": "lead", "data": lead.model_dump(mode="json")})
    return lead

@api_router.get("/leads", response_model=List[Lead])
async def list_leads(request: Request):
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    items = await db_call(db.leads.find().sort("created_at", -1).to_list(1000))
    return [Lead(**it) for it in items]

# Order intents endpoints
@api_router.post("/orders-intent", response_model=OrderIntent, status_code=201)
async def create_order_intent(input: OrderIntentCreate):
    oi = OrderIntent(**input.dict())
    await db_call(db.order_intents.insert_one(oi.dict()))
    # forward to n8n (JSON-safe payload)
    await emit_n8n(N8N_WEBHOOK_ORDER, {"type": "order_intent", "data": oi.model_dump(mode="json")})
    return oi

@api_router.get("/orders-intent", response_model=List[OrderIntent])
async def list_order_intents(request: Request):
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    items = await db_call(db.order_intents.find().sort("created_at", -1).to_list(1000))
    return [OrderIntent(**it) for it in items]

# --- Checkout integration scaffold ---
@api_router.get("/checkout/config")
async def checkout_config():
    return {
        "provider": CHECKOUT_PROVIDER,
        "public_url": CHECKOUT_PUBLIC_URL,
    }

@api_router.post("/checkout/start")
async def checkout_start(payload: CheckoutStart):
    # Persist an intent if not already stored
    oi = OrderIntent(price=payload.price, currency=payload.currency, note=payload.note, email=payload.email)
    await db_call(db.order_intents.insert_one(oi.dict()))
    await emit_n8n(N8N_WEBHOOK_ORDER, {"type": "order_intent", "data": oi.model_dump(mode="json"), "origin": "checkout_start"})

    # For now, just return a redirect URL based on env; later integrate provider API
    if CHECKOUT_PUBLIC_URL:
        sep = "&" if "?" in CHECKOUT_PUBLIC_URL else "?"
        url = f"{CHECKOUT_PUBLIC_URL}{sep}email={payload.email or ''}"
        return {"redirect_url": url, "order_intent_id": oi.id}
    # If not configured, indicate that client should fallback
    return {"redirect_url": None, "order_intent_id": oi.id}

# Newsletter endpoints
@api_router.post("/newsletter", response_model=Newsletter, status_code=201)
async def subscribe_newsletter(input: NewsletterCreate):
    sub = Newsletter(**input.dict())
    existing = await db_call(db.newsletter.find_one({"email": sub.email}))
    if existing:
        return Newsletter(**existing)
    await db_call(db.newsletter.insert_one(sub.dict()))
    await emit_n8n(N8N_WEBHOOK_NEWSLETTER, {"type": "newsletter", "data": sub.model_dump(mode="json")})
    return sub

@api_router.get("/newsletter", response_model=List[Newsletter])
async def list_newsletter(request: Request):
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    items = await db_call(db.newsletter.find().sort("created_at", -1).to_list(1000))
    return [Newsletter(**it) for it in items]

# --- Backend LLM proxy (optional) ---
from fastapi.responses import StreamingResponse

async def _iter_openrouter_stream(messages: List[dict]):
    api_keys = OPENROUTER_API_KEYS
    if not api_keys:
        # No keys configured; yield nothing so client can fallback
        return
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "HTTP-Referer": "https://example.com",
        "X-Title": "Site Chat",
    }
    for api_key in api_keys:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client_http:
                r = await client_http.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={**headers, "Authorization": f"Bearer {api_key}"},
                    json={"model": OPENROUTER_MODEL, "messages": messages, "stream": True},
                )
                if not r.is_success or r.headers.get("content-type", "").find("event-stream") == -1:
                    continue
                async with client_http.stream("POST", "https://openrouter.ai/api/v1/chat/completions",
                                              headers={**headers, "Authorization": f"Bearer {api_key}"},
                                              json={"model": OPENROUTER_MODEL, "messages": messages, "stream": True}) as resp:
                    async for line in resp.aiter_lines():
                        if not line or not line.startswith("data:"):
                            continue
                        if "[DONE]" in line:
                            yield "data: {\"done\": true}\n\n"
                            break
                        yield line + "\n"
                return
        except Exception:
            continue

@api_router.post("/chat/complete")
async def chat_complete(req: ChatCompletionRequest):
    # If server has no OpenRouter keys configured, force client fallback
    if not OPENROUTER_API_KEYS:
        raise HTTPException(status_code=503, detail="llm-backend-unavailable")

    async def event_generator():
        stream = _iter_openrouter_stream([m.model_dump() for m in req.messages])
        if stream is None:
            return
        async for chunk in stream:
            yield chunk
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# Include the router in the main app
app.include_router(api_router)

allowed = os.environ.get("ALLOWED_ORIGINS", "").strip()
origins = [o.strip() for o in allowed.split(",") if o.strip()] or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()