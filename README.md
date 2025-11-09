# 🚀 Automated Full-Stack Website Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8.svg)](https://tailwindcss.com/)

> A high-performance, fully automated full-stack web platform with CI/CD pipelines, advanced performance optimizations, and seamless integrations.

---

## ✨ Features

### 🎯 Core Features
- ⚡ **Ultra-Fast Loading** - Optimized LCP < 2.5s on mobile
- 🎨 **Modern UI/UX** - Built with React 19 and Tailwind CSS
- 🔐 **Secure Backend** - FastAPI with JWT authentication
- 📱 **Fully Responsive** - Mobile-first design approach
- 🖼️ **Image Optimization** - WebP + AVIF with lazy loading
- 🚀 **Progressive Web App** - Offline support and caching

### 🤖 Automation & DevOps
- ✅ **GitHub Actions CI/CD** - Automated testing and deployment
- 🔄 **N8N Workflows** - Business process automation
- 📊 **Performance Monitoring** - Real-time metrics tracking
- 🛠️ **Interactive Dev Manager** - One-command development setup
- 📦 **Automated Builds** - Production-ready builds on push

### 🔌 Integrations
- 💳 **Yampi E-commerce** - Seamless checkout integration
- 💬 **AI Chat Widget** - Customer support automation
- 📧 **Email Automation** - N8N-powered workflows
- 🗄️ **MongoDB Atlas** - Cloud database integration

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│  ┌────────────────────┐        ┌─────────────────────────┐  │
│  │     Frontend       │        │       Backend           │  │
│  │   (React 19)       │◄──────►│   (FastAPI/Python)      │  │
│  │   Tailwind CSS     │  HTTP  │   MongoDB               │  │
│  └────────────────────┘        └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           │                              │
           │                              │
      ┌────▼────┐                    ┌────▼────┐
      │ Netlify │                    │ Railway │
      │ /Vercel │                    │ /Render │
      └─────────┘                    └─────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.9+
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Set up environment variables**
   
   **Frontend** (`frontend/.env`):
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_ENV=development
   ```

   **Backend** (`backend/.env`):
   ```bash
   PORT=8000
   ALLOWED_ORIGINS=http://localhost:3000
   MONGO_URL=mongodb://localhost:27017/localdb
   DB_NAME=localdb
   ADMIN_API_KEY=your-secure-api-key
   ```

3. **Install dependencies**
   
   **Frontend:**
   ```bash
   cd frontend
   npm install
   ```

   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Start development servers**

   **Option 1: Interactive Dev Manager (Windows)**
   ```bash
   deploy-manager.bat
   # Select option [3] - Start Both Servers
   ```

   **Option 2: Manual**
   ```bash
   # Terminal 1: Backend
   cd backend
   uvicorn server:app --reload

   # Terminal 2: Frontend  
   cd frontend
   npm start
   ```

5. **Access the application**
   - 🎨 Frontend: http://localhost:3000
   - 🔧 Backend: http://localhost:8000
   - 📚 API Docs: http://localhost:8000/docs

---

## 📚 Documentation

### 📖 Main Guides

| Document | Description | Time |
|----------|-------------|------|
| [**DOCS/START_HERE.md**](DOCS/START_HERE.md) | Complete quick start guide | 15 min |
| [**DOCS/INDEX.md**](DOCS/INDEX.md) | 📚 **Complete documentation index** | - |
| [**DOCS/ENVIRONMENT_VARIABLES.md**](DOCS/ENVIRONMENT_VARIABLES.md) | Environment setup guide | 10 min |
| [**DOCS/COMPLETE_AUTOMATION_SETUP.md**](DOCS/COMPLETE_AUTOMATION_SETUP.md) | Full automation guide | 30 min |

### 🎯 Quick Links

- **Deployment**: [DOCS/HOSTINGER_DEPLOY.md](DOCS/HOSTINGER_DEPLOY.md)
- **Performance**: [DOCS/PERFORMANCE_OPTIMIZATION.md](DOCS/PERFORMANCE_OPTIMIZATION.md)
- **Testing**: [scripts/README_TESTS.md](scripts/README_TESTS.md)
- **Integrations**: [DOCS/YAMPI_INTEGRATION.md](DOCS/YAMPI_INTEGRATION.md)

👉 **[View Complete Documentation Index →](DOCS/INDEX.md)**

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks
- **Build Tool**: Create React App + CRACO
- **Optimization**: Sharp, WebP/AVIF

### Backend
- **Framework**: FastAPI 0.110.1
- **Server**: Uvicorn
- **Database**: MongoDB + Motor (async)
- **Authentication**: JWT, PassLib
- **Validation**: Pydantic
- **Testing**: Pytest

### DevOps & Automation
- **CI/CD**: GitHub Actions
- **Automation**: N8N Workflows
- **Deployment**: 
  - Frontend: Netlify/Vercel/Hostinger
  - Backend: Railway/Render
- **Monitoring**: Custom performance tracking

---

## 🎯 Performance

### Lighthouse Scores

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Performance | 98+ | 95+ |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

### Key Metrics

- **LCP**: < 2.5s (mobile)
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.8s

### Optimizations

- ✅ Critical CSS inlining
- ✅ Image optimization (WebP + AVIF)
- ✅ Code splitting & lazy loading
- ✅ Service worker caching
- ✅ Preconnect to required origins
- ✅ Font optimization

---

## 📦 Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── build/               # Production build
│
├── backend/                  # FastAPI backend application
│   ├── server.py            # Main FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── __pycache__/         # Python cache
│
├── scripts/                  # Automation scripts
│   ├── deploy-frontend.ps1  # Frontend deployment
│   ├── optimize-images.js   # Image optimization
│   └── test_stability.py    # Stability tests
│
├── DOCS/                     # 📚 Complete documentation
│   ├── INDEX.md             # Documentation index
│   ├── START_HERE.md        # Quick start guide
│   └── ...                  # 50+ documentation files
│
├── deploy-manager.bat        # Interactive dev manager
├── railway.json             # Railway deployment config
├── render.yaml              # Render deployment config
├── Procfile                 # Heroku/Railway process file
└── README.md                # This file
```

---

## 🚀 Deployment

### Frontend Deployment

#### Netlify/Vercel (Recommended)

1. Connect your GitHub repository
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `frontend`
3. Add environment variables
4. Deploy!

#### Hostinger (Manual/Automated)

```bash
# Use the automated deployment script
cd scripts
.\deploy-frontend.ps1
```

### Backend Deployment

#### Railway (Recommended)

1. Connect your GitHub repository
2. Add `backend/` as the root directory
3. Railway auto-detects Python and uses `Procfile`
4. Add environment variables
5. Deploy!

#### Render

1. Connect your GitHub repository
2. Create a new Web Service
3. Use `backend/` as the root directory
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

---

## 🧪 Testing

### Run Tests

**Frontend**:
```bash
cd frontend
npm test
```

**Backend**:
```bash
cd backend
pytest
```

**Stability Tests**:
```bash
python scripts/test_stability.py
```

---

## 🔧 Development Tools

### Dev Manager (Windows)

Interactive command-line tool for common development tasks:

```bash
deploy-manager.bat
```

**Features**:
- Start/stop servers
- Build for production
- Run tests
- Deploy to production
- Check environment variables
- Clean build artifacts
- Optimize images

---

## 📊 Monitoring & Analytics

- **Performance**: Lighthouse CI integration
- **Errors**: Automatic error logging
- **Analytics**: Custom event tracking
- **Health**: Server health checks

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm test  # Frontend
   pytest    # Backend
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

---

## 🔒 Security

- **Authentication**: JWT-based authentication
- **CORS**: Configured with allowed origins
- **Environment Variables**: Sensitive data in `.env` files
- **Input Validation**: Pydantic models
- **SQL Injection**: MongoDB parameterized queries
- **HTTPS**: Enforced in production

**Found a security issue?** Please email security@yourdomain.com instead of creating a public issue.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [N8N](https://n8n.io/) - Workflow automation

---

## 📞 Support

- **Documentation**: [DOCS/INDEX.md](DOCS/INDEX.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)

---

## 📈 Roadmap

- [ ] GraphQL API implementation
- [ ] WebSocket real-time features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Advanced caching strategies
- [ ] Microservices architecture

---

## 📸 Screenshots

### Desktop View
![Desktop View](frontend/public/images/desktop-preview.webp)

### Mobile View
![Mobile View](frontend/public/images/mobile-preview.webp)

---

## ⚡ Quick Commands

```bash
# Development
npm start                    # Start frontend
uvicorn server:app --reload  # Start backend

# Production
npm run build               # Build frontend
npm run build:full          # Build with image optimization

# Testing
npm test                    # Frontend tests
pytest                      # Backend tests

# Deployment
git push origin main        # Triggers CI/CD
deploy-manager.bat          # Interactive deployment

# Utilities
npm run optimize:images     # Optimize all images
python scripts/check_secrets.py  # Check for exposed secrets
```

---

**Built with ❤️ using React, FastAPI, and modern web technologies**

**⭐ Star this repo if you find it useful!**

---

<div align="center">

[**Documentation**](DOCS/INDEX.md) • [**Quick Start**](DOCS/START_HERE.md) • [**Contributing**](CONTRIBUTING.md) • [**License**](LICENSE)

</div>
