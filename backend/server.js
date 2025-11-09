import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env') });

// Environment variables
const PORT = process.env.PORT || 8000;
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*').split(',').map(o => o.trim());
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_KEYS = (process.env.OPENROUTER_API_KEYS || OPENROUTER_API_KEY)
  .replace(/;/g, ',')
  .split(',')
  .map(k => k.trim())
  .filter(k => k);
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
const CHECKOUT_PUBLIC_URL = process.env.CHECKOUT_PUBLIC_URL || '';
const CHECKOUT_PROVIDER = process.env.CHECKOUT_PROVIDER || 'yampi';

// Initialize Supabase
let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('✅ Supabase connected');
} else {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Database operations will fail.');
}

// Helper: Check Supabase connection
function checkSupabase() {
  if (!supabase) {
    throw { statusCode: 500, message: 'Database not configured' };
  }
}

// Initialize Fastify
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Register plugins
await fastify.register(cors, {
  origin: ALLOWED_ORIGINS[0] === '*' ? true : ALLOWED_ORIGINS,
  credentials: false
});

await fastify.register(formbody);

// ============================================
// ROUTES
// ============================================

// Health check
fastify.get('/api/', async (request, reply) => {
  return { message: 'Hello World', database: 'Supabase PostgreSQL' };
});

// ============================================
// STATUS CHECKS
// ============================================
fastify.post('/api/status', async (request, reply) => {
  checkSupabase();
  
  const { client_name } = request.body;
  const status = {
    id: randomUUID(),
    client_name,
    timestamp: new Date().toISOString()
  };
  
  try {
    await supabase.from('status_checks').insert(status);
    return status;
  } catch (error) {
    fastify.log.error(`Error creating status check: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

fastify.get('/api/status', async (request, reply) => {
  checkSupabase();
  
  try {
    const { data, error } = await supabase
      .from('status_checks')
      .select('*')
      .limit(1000);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    fastify.log.error(`Error fetching status checks: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

// ============================================
// LEADS
// ============================================
fastify.post('/api/leads', async (request, reply) => {
  checkSupabase();
  
  const { email, source } = request.body;
  
  try {
    // Check if lead already exists
    const { data: existing } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (existing) {
      fastify.log.info(`Lead already exists: ${email}`);
      return reply.code(201).send(existing);
    }
    
    // Create new lead
    const lead = {
      id: randomUUID(),
      email,
      source: source || null,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('leads').insert(lead);
    if (error) throw error;
    
    fastify.log.info(`New lead created: ${email}`);
    return reply.code(201).send(lead);
  } catch (error) {
    fastify.log.error(`Error creating lead: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

fastify.get('/api/leads', async (request, reply) => {
  checkSupabase();
  
  // Check admin key
  if (ADMIN_API_KEY && request.headers['x-admin-key'] !== ADMIN_API_KEY) {
    throw { statusCode: 401, message: 'unauthorized' };
  }
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    fastify.log.error(`Error fetching leads: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

// ============================================
// ORDER INTENTS
// ============================================
fastify.post('/api/orders-intent', async (request, reply) => {
  checkSupabase();
  
  const { price, currency, note, email } = request.body;
  
  const orderIntent = {
    id: randomUUID(),
    price: parseFloat(price),
    currency,
    note: note || null,
    email: email || null,
    created_at: new Date().toISOString()
  };
  
  try {
    const { error } = await supabase.from('order_intents').insert(orderIntent);
    if (error) throw error;
    
    fastify.log.info(`Order intent created: ${orderIntent.id}`);
    return reply.code(201).send(orderIntent);
  } catch (error) {
    fastify.log.error(`Error creating order intent: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

fastify.get('/api/orders-intent', async (request, reply) => {
  checkSupabase();
  
  // Check admin key
  if (ADMIN_API_KEY && request.headers['x-admin-key'] !== ADMIN_API_KEY) {
    throw { statusCode: 401, message: 'unauthorized' };
  }
  
  try {
    const { data, error } = await supabase
      .from('order_intents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    fastify.log.error(`Error fetching order intents: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

// ============================================
// CHECKOUT
// ============================================
fastify.get('/api/checkout/config', async (request, reply) => {
  return {
    provider: CHECKOUT_PROVIDER,
    public_url: CHECKOUT_PUBLIC_URL
  };
});

fastify.post('/api/checkout/start', async (request, reply) => {
  checkSupabase();
  
  const { price, currency, note, email } = request.body;
  
  const orderIntent = {
    id: randomUUID(),
    price: parseFloat(price),
    currency,
    note: note || null,
    email: email || null,
    created_at: new Date().toISOString()
  };
  
  try {
    const { error } = await supabase.from('order_intents').insert(orderIntent);
    if (error) throw error;
    
    fastify.log.info(`Checkout started: ${orderIntent.id}`);
    
    // Build redirect URL
    let redirect_url = null;
    if (CHECKOUT_PUBLIC_URL) {
      const separator = CHECKOUT_PUBLIC_URL.includes('?') ? '&' : '?';
      redirect_url = `${CHECKOUT_PUBLIC_URL}${separator}email=${email || ''}`;
    }
    
    return {
      redirect_url,
      order_intent_id: orderIntent.id
    };
  } catch (error) {
    fastify.log.error(`Error in checkout start: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

// ============================================
// NEWSLETTER
// ============================================
fastify.post('/api/newsletter', async (request, reply) => {
  checkSupabase();
  
  const { email, source } = request.body;
  
  try {
    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('newsletter')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (existing) {
      fastify.log.info(`Newsletter subscription already exists: ${email}`);
      return reply.code(201).send(existing);
    }
    
    // Create new subscription
    const subscription = {
      id: randomUUID(),
      email,
      source: source || null,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('newsletter').insert(subscription);
    if (error) throw error;
    
    fastify.log.info(`Newsletter subscription created: ${email}`);
    return reply.code(201).send(subscription);
  } catch (error) {
    fastify.log.error(`Error creating newsletter subscription: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

fastify.get('/api/newsletter', async (request, reply) => {
  checkSupabase();
  
  // Check admin key
  if (ADMIN_API_KEY && request.headers['x-admin-key'] !== ADMIN_API_KEY) {
    throw { statusCode: 401, message: 'unauthorized' };
  }
  
  try {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    fastify.log.error(`Error fetching newsletter subscriptions: ${error.message}`);
    throw { statusCode: 500, message: `Database error: ${error.message}` };
  }
});

// ============================================
// AI CHAT (OpenRouter Proxy)
// ============================================
fastify.post('/api/chat/complete', async (request, reply) => {
  const { messages, stream = true } = request.body;
  
  if (!OPENROUTER_API_KEYS || OPENROUTER_API_KEYS.length === 0) {
    throw { statusCode: 503, message: 'llm-backend-unavailable' };
  }
  
  // Try each API key until one works
  for (const apiKey of OPENROUTER_API_KEYS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://silviosuperandolimites.com.br',
          'X-Title': 'Superando Limites Chat'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages,
          stream: true
        })
      });
      
      if (!response.ok) {
        fastify.log.warn(`OpenRouter attempt failed with status ${response.status}`);
        continue;
      }
      
      // Stream the response
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        reply.raw.write(chunk);
      }
      
      reply.raw.end();
      return reply;
      
    } catch (error) {
      fastify.log.warn(`OpenRouter attempt failed: ${error.message}`);
      continue;
    }
  }
  
  // All keys failed
  throw { statusCode: 503, message: 'All OpenRouter API keys failed' };
});

// ============================================
// ERROR HANDLER
// ============================================
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  reply.code(statusCode).send({
    error: message,
    statusCode
  });
});

// ============================================
// START SERVER
// ============================================
const start = async () => {
  try {
    await fastify.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    
    console.log('');
    console.log('🚀 ============================================');
    console.log(`   Server running on http://0.0.0.0:${PORT}`);
    console.log('   ============================================');
    console.log('');
    console.log('📦 Configuration:');
    console.log(`   - Database: ${SUPABASE_URL ? '✅ Supabase' : '❌ Not configured'}`);
    console.log(`   - OpenRouter: ${OPENROUTER_API_KEYS.length > 0 ? `✅ ${OPENROUTER_API_KEYS.length} key(s)` : '❌ Not configured'}`);
    console.log(`   - CORS: ${ALLOWED_ORIGINS[0] === '*' ? '* (all origins)' : ALLOWED_ORIGINS.join(', ')}`);
    console.log(`   - Admin API: ${ADMIN_API_KEY ? '✅ Protected' : '⚠️  Not protected'}`);
    console.log('');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

