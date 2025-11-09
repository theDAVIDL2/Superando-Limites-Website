import os
from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import httpx
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ.get('SUPABASE_URL', '')
supabase_key = os.environ.get('SUPABASE_SERVICE_KEY', '')

if not supabase_url or not supabase_key:
    logging.warning("SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Database operations will fail.")
    supabase: Optional[Client] = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Checkout integration (Yampi/Stripe/etc.)
CHECKOUT_PUBLIC_URL = os.environ.get("CHECKOUT_PUBLIC_URL", "")
CHECKOUT_PROVIDER = os.environ.get("CHECKOUT_PROVIDER", "yampi")

# Optional admin key (protects list endpoints if set)
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

# OpenRouter server-side config (for backend proxy)
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_API_KEYS = [k.strip() for k in os.environ.get("OPENROUTER_API_KEYS", "").replace(";", ",").split(",") if k.strip()] or ([OPENROUTER_API_KEY] if OPENROUTER_API_KEY else [])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Leads
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeadCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = None

# Order Intents
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

# Newsletter subscribers
class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NewsletterCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = None


# Helper function to check Supabase connection
def check_supabase():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World", "database": "Supabase PostgreSQL"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    check_supabase()
    status_obj = StatusCheck(**input.dict())
    data = status_obj.dict()
    data['timestamp'] = data['timestamp'].isoformat()
    
    try:
        supabase.table('status_checks').insert(data).execute()
        return status_obj
    except Exception as e:
        logger.error(f"Error creating status check: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    check_supabase()
    try:
        result = supabase.table('status_checks').select('*').limit(1000).execute()
        return [StatusCheck(**item) for item in result.data]
    except Exception as e:
        logger.error(f"Error fetching status checks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Leads endpoints
@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(input: LeadCreate):
    check_supabase()
    lead = Lead(**input.dict())
    
    try:
        # Check if email already exists
        existing = supabase.table('leads').select('*').eq('email', lead.email).execute()
        if existing.data:
            logger.info(f"Lead already exists: {lead.email}")
            return Lead(**existing.data[0])
        
        # Insert new lead
        data = lead.dict()
        data['created_at'] = data['created_at'].isoformat()
        supabase.table('leads').insert(data).execute()
        logger.info(f"New lead created: {lead.email}")
        return lead
    except Exception as e:
        logger.error(f"Error creating lead: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/leads", response_model=List[Lead])
async def list_leads(request: Request):
    check_supabase()
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    try:
        result = supabase.table('leads').select('*').order('created_at', desc=True).limit(1000).execute()
        return [Lead(**item) for item in result.data]
    except Exception as e:
        logger.error(f"Error fetching leads: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Order intents endpoints
@api_router.post("/orders-intent", response_model=OrderIntent, status_code=201)
async def create_order_intent(input: OrderIntentCreate):
    check_supabase()
    oi = OrderIntent(**input.dict())
    
    try:
        data = oi.dict()
        data['created_at'] = data['created_at'].isoformat()
        supabase.table('order_intents').insert(data).execute()
        logger.info(f"Order intent created: {oi.id}")
        return oi
    except Exception as e:
        logger.error(f"Error creating order intent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/orders-intent", response_model=List[OrderIntent])
async def list_order_intents(request: Request):
    check_supabase()
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    try:
        result = supabase.table('order_intents').select('*').order('created_at', desc=True).limit(1000).execute()
        return [OrderIntent(**item) for item in result.data]
    except Exception as e:
        logger.error(f"Error fetching order intents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Checkout integration scaffold
@api_router.get("/checkout/config")
async def checkout_config():
    return {
        "provider": CHECKOUT_PROVIDER,
        "public_url": CHECKOUT_PUBLIC_URL,
    }

@api_router.post("/checkout/start")
async def checkout_start(payload: CheckoutStart):
    check_supabase()
    # Persist an intent
    oi = OrderIntent(price=payload.price, currency=payload.currency, note=payload.note, email=payload.email)
    
    try:
        data = oi.dict()
        data['created_at'] = data['created_at'].isoformat()
        supabase.table('order_intents').insert(data).execute()
        logger.info(f"Checkout started: {oi.id}")
    except Exception as e:
        logger.error(f"Error in checkout start: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Return redirect URL based on env
    if CHECKOUT_PUBLIC_URL:
        sep = "&" if "?" in CHECKOUT_PUBLIC_URL else "?"
        url = f"{CHECKOUT_PUBLIC_URL}{sep}email={payload.email or ''}"
        return {"redirect_url": url, "order_intent_id": oi.id}
    
    return {"redirect_url": None, "order_intent_id": oi.id}

# Newsletter endpoints
@api_router.post("/newsletter", response_model=Newsletter, status_code=201)
async def subscribe_newsletter(input: NewsletterCreate):
    check_supabase()
    sub = Newsletter(**input.dict())
    
    try:
        # Check if email already exists
        existing = supabase.table('newsletter').select('*').eq('email', sub.email).execute()
        if existing.data:
            logger.info(f"Newsletter subscription already exists: {sub.email}")
            return Newsletter(**existing.data[0])
        
        # Insert new subscription
        data = sub.dict()
        data['created_at'] = data['created_at'].isoformat()
        supabase.table('newsletter').insert(data).execute()
        logger.info(f"Newsletter subscription created: {sub.email}")
        return sub
    except Exception as e:
        logger.error(f"Error creating newsletter subscription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/newsletter", response_model=List[Newsletter])
async def list_newsletter(request: Request):
    check_supabase()
    if ADMIN_API_KEY and request.headers.get("x-admin-key") != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    try:
        result = supabase.table('newsletter').select('*').order('created_at', desc=True).limit(1000).execute()
        return [Newsletter(**item) for item in result.data]
    except Exception as e:
        logger.error(f"Error fetching newsletter subscriptions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Backend LLM proxy (AI Chat - unchanged)
from fastapi.responses import StreamingResponse

async def _iter_openrouter_stream(messages: List[dict]):
    api_keys = OPENROUTER_API_KEYS
    if not api_keys:
        # No keys configured; yield nothing so client can fallback
        return
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "HTTP-Referer": "https://silviosuperandolimites.com.br",
        "X-Title": "Superando Limites Chat",
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
        except Exception as e:
            logger.warning(f"OpenRouter attempt failed: {str(e)}")
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

# CORS configuration
allowed = os.environ.get("ALLOWED_ORIGINS", "").strip()
origins = [o.strip() for o in allowed.split(",") if o.strip()] or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
