# API Contracts — Book Landing (Leads + Order Intent)

Scope: Implement minimal backend to persist newsletter leads and purchase intents for the book “Seja protagonista da sua própria história”. Frontend will integrate and remove local mocks.

Base URL
- Frontend must use process.env.REACT_APP_BACKEND_URL as base and prefix all calls with /api
- Backend already bound at 0.0.0.0:8001 via supervisor (do not change)

Collections (MongoDB)
- leads
  - id: string (uuid4)
  - email: string (validated)
  - source: string | null
  - created_at: ISO datetime (UTC)
- order_intents
  - id: string (uuid4)
  - price: number
  - currency: string (e.g., "BRL")
  - created_at: ISO datetime (UTC)
  - note: string | null (optional comment)

Endpoints (all prefixed with /api)
1) POST /api/leads
   - Body: { email: string, source?: string }
   - 201 OK: Lead (JSON)
   - 422: validation error (invalid email)
   - Side effects: insert into leads

2) GET /api/leads
   - 200 OK: Lead[] (for basic verification/testing)

3) POST /api/orders-intent
   - Body: { price: number, currency: string, note?: string }
   - 201 OK: OrderIntent (JSON)
   - Side effects: insert into order_intents

4) GET /api/orders-intent
   - 200 OK: OrderIntent[]

Frontend Integration Plan
- Remove localStorage mocks for leads and purchase
- Landing.jsx
  - handleLead: POST to /api/leads
  - handleBuy: POST to /api/orders-intent
  - On success, show Sonner success toast; on error, show error toast
  - Keep UI behavior identical

Mocking Notes
- Until payment (Yampi) is integrated, “Comprar” only logs an order_intent (no external redirect)
- Placeholder images will be used for cover/autor until assets are provided

Testing Plan
- Backend first using deep_testing_backend_v2
- Verify: POST /api/leads, GET /api/leads, POST /api/orders-intent, GET /api/orders-intent
- After backend passes, optionally run frontend tests (ask user each time)