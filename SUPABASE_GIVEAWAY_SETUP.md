# Supabase Giveaway Table Setup

Execute this SQL in your Supabase SQL Editor to create the giveaway_entries table:

```sql
-- Create giveaway_entries table
CREATE TABLE giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  has_book BOOLEAN NOT NULL DEFAULT false,
  instagram TEXT,
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_neighborhood TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zipcode TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_whatsapp UNIQUE (whatsapp)
);

-- Create indexes for better query performance
CREATE INDEX idx_giveaway_created ON giveaway_entries(created_at DESC);
CREATE INDEX idx_giveaway_email ON giveaway_entries(email);

-- Enable Row Level Security (RLS)
ALTER TABLE giveaway_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for public form submission)
CREATE POLICY "Allow public inserts" ON giveaway_entries
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads only with service role (admin only)
CREATE POLICY "Allow service role full access" ON giveaway_entries
  FOR ALL
  USING (auth.role() = 'service_role');
```

## Environment Variables

Add these to your backend `.env` file:

```env
GIVEAWAY_ENABLED=true
GIVEAWAY_END_DATE=2025-12-31T23:59:59Z
GIVEAWAY_PRIZE_NAME=Camisa do Time
```

Add these to Railway dashboard:

1. Go to your Railway project
2. Click on your backend service
3. Go to "Variables" tab
4. Add:
   - `GIVEAWAY_ENABLED` = `true`
   - `GIVEAWAY_END_DATE` = `2025-12-31T23:59:59Z`
   - `GIVEAWAY_PRIZE_NAME` = `Camisa do Time`

## Testing

1. **Check if giveaway is active:**
   ```bash
   curl https://your-backend.railway.app/api/giveaway/status
   ```

2. **Submit test entry:**
   ```bash
   curl -X POST https://your-backend.railway.app/api/giveaway \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Test User",
       "email": "test@example.com",
       "whatsapp": "11987654321",
       "has_book": false,
       "instagram": "@testuser",
       "address_street": "Test Street",
       "address_number": "123",
       "address_complement": "Apt 1",
       "address_neighborhood": "Test Neighborhood",
       "address_city": "Test City",
       "address_state": "TS",
       "address_zipcode": "12345-678"
     }'
   ```

3. **View entries (admin):**
   ```bash
   curl -H "x-admin-key: your_admin_key" \
     https://your-backend.railway.app/api/giveaway/entries
   ```

## Admin Access

### Via Supabase Dashboard

```sql
SELECT * FROM giveaway_entries ORDER BY created_at DESC;
```

### Via API

```bash
curl -H "x-admin-key: your_admin_key" \
  https://your-backend.railway.app/api/giveaway/entries
```

## Disabling the Giveaway

When the giveaway ends, update the environment variable:

```env
GIVEAWAY_ENABLED=false
```

Or let it expire automatically by setting:

```env
GIVEAWAY_END_DATE=2025-12-31T23:59:59Z
```

The banner and modal will automatically hide, and the form will redirect users back to the homepage.

