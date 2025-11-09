# 🔐 Environment Variables Configuration Guide

## 📁 Backend `.env` File

**Location:** `backend/.env`

**Create this file and add:**

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get these from: https://supabase.com/dashboard/project/_/settings/api
SUPABASE_URL=https://imxztrnidhwshgebomrd.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# ============================================
# CORS CONFIGURATION
# ============================================
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,https://silviosuperandolimites.com.br

# ============================================
# ADMIN ACCESS
# ============================================
# Secret key for admin endpoints (generate a strong random key)
ADMIN_API_KEY=your_admin_key_here

# ============================================
# AI CHAT (OPENROUTER)
# ============================================
# Get your API key from: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_key_here

# ============================================
# GIVEAWAY CONFIGURATION (REQUIRED FOR BANNER/MODAL!)
# ============================================
# Enable/disable the giveaway feature
GIVEAWAY_ENABLED=true

# End date in ISO 8601 format (giveaway will auto-hide after this date)
GIVEAWAY_END_DATE=2025-12-31T23:59:59Z

# Prize name to display
GIVEAWAY_PRIZE_NAME=Camisa do Time
```

---

## 📁 Frontend `.env` File

**Location:** `frontend/.env`

**Create this file and add:**

```env
# ============================================
# BACKEND API URL
# ============================================
# For local development
REACT_APP_BACKEND_URL=http://localhost:8000

# For production (uncomment and update when deploying)
# REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

---

## 🚀 Steps to Apply Configuration

### 1. Create Backend `.env`

```bash
# Open terminal in project root
cd backend

# Create .env file (Windows)
notepad .env

# Or use any text editor
# Copy the content from "Backend .env File" section above
```

### 2. Create Frontend `.env`

```bash
# Open terminal in project root
cd frontend

# Create .env file (Windows)
notepad .env

# Or use any text editor
# Copy the content from "Frontend .env File" section above
```

### 3. Update Credentials

You need to replace these placeholders:

- **`SUPABASE_SERVICE_KEY`** - Get from Supabase Dashboard:
  1. Go to https://supabase.com/dashboard/project/imxztrnidhwshgebomrd/settings/api
  2. Copy the `service_role` key (NOT the `anon` key)
  
- **`ADMIN_API_KEY`** - Create your own secret key:
  - Example: `my-super-secret-admin-key-12345`
  
- **`OPENROUTER_API_KEY`** - Get from OpenRouter:
  1. Go to https://openrouter.ai/keys
  2. Create a new API key

### 4. Restart Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## ✅ Verification

### Check if Giveaway is Active

Visit in your browser:
```
http://localhost:8000/api/giveaway/status
```

**Expected Response:**
```json
{
  "active": true,
  "prize": "Camisa do Time",
  "end_date": "2025-12-31T23:59:59Z"
}
```

### Check Frontend

1. Visit: `http://localhost:3000`
2. Open DevTools (F12) → Console tab
3. Wait 3 seconds
4. You should see:
   - ✅ Orange banner at the top
   - ✅ Modal popup after 3 seconds

---

## 🐛 Troubleshooting

### Banner/Modal Don't Appear

**Problem 1:** `GIVEAWAY_ENABLED` not set
- **Solution:** Make sure `GIVEAWAY_ENABLED=true` is in `backend/.env`

**Problem 2:** Backend URL wrong
- **Solution:** Check `REACT_APP_BACKEND_URL=http://localhost:8000` in `frontend/.env`

**Problem 3:** Backend not running
- **Solution:** Run `cd backend && npm start`

**Problem 4:** LocalStorage blocking
- **Solution:** Open DevTools → Application → Local Storage → Clear all
- Then refresh the page

### CORS Errors

If you see CORS errors in console:
- Check `ALLOWED_ORIGINS` includes `http://localhost:3000`
- Restart backend after changing `.env`

### Supabase Errors

If you see "Supabase not configured":
- Make sure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set
- Check the keys are correct (no extra spaces)
- Restart backend

---

## 📊 File Structure

```
Website/
├── backend/
│   ├── .env          ← CREATE THIS (use backend config above)
│   ├── package.json
│   └── server.js
└── frontend/
    ├── .env          ← CREATE THIS (use frontend config above)
    ├── package.json
    └── src/
```

---

## 🎯 Quick Copy-Paste

### For Backend `.env`:
```env
SUPABASE_URL=https://imxztrnidhwshgebomrd.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
ALLOWED_ORIGINS=http://localhost:3000,https://silviosuperandolimites.com.br
ADMIN_API_KEY=your_admin_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
GIVEAWAY_ENABLED=true
GIVEAWAY_END_DATE=2025-12-31T23:59:59Z
GIVEAWAY_PRIZE_NAME=Camisa do Time
```

### For Frontend `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain secrets!
2. **Restart servers** after changing `.env` files
3. **Clear browser cache** if changes don't appear
4. **Check browser console** for errors (F12)

---

## 🎉 You're Done!

After setting up both `.env` files and restarting:

1. ✅ Orange banner should appear at top
2. ✅ Modal popup after 3 seconds
3. ✅ Click "Participar" → Go to `/sorteio` page
4. ✅ Fill form and submit

Need help? Check the console for errors!

