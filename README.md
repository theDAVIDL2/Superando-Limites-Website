# 📖 Superando Limites - Website Oficial

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green.svg)](https://fastapi.tiangolo.com/)
[![Live](https://img.shields.io/badge/Live-silviosuperandolimites.com.br-success.svg)](https://silviosuperandolimites.com.br/)

> Website oficial do livro "Superando Limites" de Silvio - Uma plataforma completa para marketing e vendas do livro.

🌐 **Website:** [silviosuperandolimites.com.br](https://silviosuperandolimites.com.br/)

---

## 📚 Sobre o Projeto

Landing page moderna e performática para o livro "Superando Limites", desenvolvida com as melhores práticas de web development. O projeto está sendo expandido para se tornar uma plataforma completa de marketing para o livro.

### 🎯 Funcionalidades Atuais

- 📖 **Landing Page do Livro** - Design moderno e responsivo
- 💳 **Integração Yampi** - Checkout direto para compra do livro
- 💬 **Chat com IA** - Suporte automatizado ao cliente
- 📧 **Captura de Leads** - Formulário integrado com N8N
- 🖼️ **Imagens Otimizadas** - WebP + AVIF para carregamento ultra-rápido
- 📱 **Mobile-First** - Experiência perfeita em dispositivos móveis

### 🚀 Próximas Funcionalidades

- [ ] Blog sobre os temas do livro
- [ ] Área de membros
- [ ] Recursos exclusivos para leitores
- [ ] Newsletter automatizada
- [ ] Depoimentos e reviews
- [ ] Material complementar

---

## 🛠️ Tecnologias

### Frontend
- **React 19.0** - Interface moderna e performática
- **Tailwind CSS** - Design system e estilos
- **Radix UI** - Componentes acessíveis
- **Lazy Loading** - Carregamento otimizado de imagens

### Backend
- **FastAPI** - API REST moderna e rápida
- **MongoDB** - Banco de dados para leads e analytics
- **N8N** - Automação de workflows (emails, notificações)

### DevOps
- **GitHub Actions** - CI/CD automatizado
- **Railway** - Hospedagem do backend
- **Hostinger** - Hospedagem do frontend
- **Automated Testing** - Testes automatizados

---

## ⚡ Performance

O site foi otimizado para máxima performance:

| Métrica | Desktop | Mobile |
|---------|---------|--------|
| Performance | 98+ | 95+ |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

**Métricas Principais:**
- **LCP**: < 2.5s (mobile)
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 16+
- Python 3.9+
- MongoDB (local ou Atlas)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/grilojr09br/Superando-Limites-Website.git
cd Superando-Limites-Website

# Use o Dev Manager (Windows)
deploy-manager.bat
# Selecione [4] Install All Dependencies
# Selecione [3] Start Both Servers

# Ou manualmente:
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn server:app --reload
```

### Acesso

- 🎨 Frontend: http://localhost:3000
- ⚡ Backend: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

---

## 📦 Estrutura do Projeto

```
Superando-Limites-Website/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Landing page
│   │   └── hooks/         # Custom hooks
│   └── public/            # Assets estáticos
│
├── backend/               # FastAPI application
│   ├── server.py         # API principal
│   └── requirements.txt  # Dependências Python
│
├── scripts/              # Scripts de automação
│   └── *.ps1            # Helper scripts PowerShell
│
├── DOCS/                 # 📚 Documentação completa
│   ├── START_HERE.md    # Guia de início rápido
│   └── INDEX.md         # Índice de documentação
│
└── deploy-manager.bat   # Dev Manager interativo
```

---

## 📚 Documentação

### Guias Principais

- **[Quick Start →](DOCS/START_HERE.md)** - Comece aqui!
- **[Environment Setup →](DOCS/ENVIRONMENT_VARIABLES.md)** - Configuração de variáveis
- **[Yampi Integration →](DOCS/YAMPI_INTEGRATION.md)** - Integração de checkout
- **[Complete Index →](DOCS/INDEX.md)** - Toda a documentação

### Para Desenvolvedores

- **Dev Manager**: Execute `deploy-manager.bat` para menu interativo
- **Scripts**: Veja `scripts/README_SCRIPTS.md`
- **Contributing**: Veja [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🚀 Deployment

### Frontend (Hostinger)

```bash
# Usando o deploy manager
deploy-manager.bat
# Selecione [8] Deploy Frontend

# Ou manualmente
cd frontend
npm run build
# Upload do conteúdo de build/ para servidor
```

### Backend (Railway)

```bash
# Push para GitHub (auto-deploy)
git push origin main

# Railway detecta e faz deploy automaticamente
```

**Guias detalhados:** [DOCS/HOSTINGER_DEPLOY.md](DOCS/HOSTINGER_DEPLOY.md)

---

## 🔌 Integrações

### Yampi (E-commerce)
- Checkout direto integrado
- Link de pagamento customizado
- Webhook para notificações

### N8N (Automação)
- Captura de leads por email
- Notificações automáticas
- Workflows personalizados

### OpenRouter (AI Chat)
- Chat de suporte com IA
- Respostas automáticas
- Múltiplas chaves para balanceamento

---

## 🛠️ Dev Tools

### Deploy Manager

Menu interativo para todas as tarefas de desenvolvimento:

```batch
deploy-manager.bat
```

**Principais comandos:**
- `[3]` Start Both Servers
- `[7]` Build & Test Everything
- `[11]` Check Environment Variables
- `[15]` Check System Requirements

---

## 🔒 Segurança

- JWT authentication no backend
- CORS configurado corretamente
- Variáveis sensíveis em `.env` (não versionado)
- Rate limiting implementado
- Input validation com Pydantic

**Política de Segurança:** [SECURITY.md](SECURITY.md)

---

## 📊 Analytics & Monitoring

- Performance tracking integrado
- Error logging automático
- N8N webhooks para notificações
- GitHub Actions para CI/CD

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md).

### Fluxo de Desenvolvimento

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m "feat: adiciona nova funcionalidade"`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT - veja [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Davie Manuel Neymar** ([@grilojr09br](https://github.com/grilojr09br))

**Projeto:** Superando Limites - Livro de Silvio

---

## 🔗 Links

- **Website:** https://silviosuperandolimites.com.br/
- **Repositório:** https://github.com/grilojr09br/Superando-Limites-Website
- **Issues:** https://github.com/grilojr09br/Superando-Limites-Website/issues

---

## 📞 Suporte

- 📧 **Email:** daviemanuelneymar@gmail.com
- 💬 **Discussions:** [GitHub Discussions](https://github.com/grilojr09br/Superando-Limites-Website/discussions)

---

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

---

<div align="center">

**Desenvolvido com ❤️ para o livro "Superando Limites"**

[Website](https://silviosuperandolimites.com.br/) • [Documentation](DOCS/INDEX.md) • [Contributing](CONTRIBUTING.md)

</div>
