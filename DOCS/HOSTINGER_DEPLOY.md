## Hospedagem do site e imagens na Hostinger — Guia prático

Este guia explica como colocar no ar o seu site (Create React App) e como hospedar imagens com desempenho e custo eficientes usando Hostinger. Traz também configurações prontas (.htaccess) para SPA, cache e HTTPS.

### 1) Estrutura recomendada para imagens
- **Opção A — Imagens no próprio host (mais simples):**
  - Coloque os arquivos em `public_html/images/` (ou `/public/images/` se em subpasta). No projeto, use caminhos absolutos como `/images/capa.webp`.
  - Versione o nome do arquivo (ex.: `capa.v1.webp`) para forçar atualização de cache quando trocar uma imagem.
- **Opção B — CDN externo (melhor desempenho):**
  - Coloque as imagens em um bucket/object storage (p. ex., Cloudflare R2, S3 compatível) e sirva via CDN (Cloudflare CDN, etc.).
  - Use URLs absolutas CDN no código (ex.: `https://cdn.seudominio.com/capa.webp`).

Recomendação: comece com Opção A (rápido) e, se o tráfego crescer, migre as imagens para uma CDN mantendo os mesmos caminhos (via CNAME `cdn.seudominio.com`).

#### Boas práticas para imagens
- Gere versões em **WebP** (e AVIF se possível); mantenha originais JPEG/PNG só quando necessário.
- Exporte em múltiplas larguras (por ex.: 640/1280/1920) e use `width`/`height` no `<img>` para evitar layout shift.
- Use `loading="lazy"` para imagens fora da dobra.
- Comprimir e otimizar (TinyPNG, Squoosh, imagemin, etc.).

---

### 2) Build do frontend (Create React App)
1. Configure variáveis de ambiente antes do build (ex.: `REACT_APP_BACKEND_URL`).
2. Gerar build:
```bash
yarn build
# saída em frontend/build/
```
3. Compacte o conteúdo de `frontend/build/` em um `.zip` (somente o conteúdo interno, não a pasta-mãe).

---

### 3) Publicação na Hostinger (hPanel)
1. Acesse o **hPanel** → Websites → **Gerenciar** seu domínio.
2. Abra **Gerenciador de Arquivos**.
3. Navegue até a raiz do site:
   - Site principal: `public_html/`
   - Subdomínio ou site adicional: pasta raiz configurada para esse domínio (ex.: `public_html/protagonista/`).
4. Envie o `.zip` do build e extraia-o, garantindo que `index.html`, `asset-manifest.json`, `static/` etc. fiquem na raiz do site escolhido.
5. Garanta que o arquivo `.htaccess` (abaixo) esteja na mesma raiz do `index.html`.

> Observação: Em hospedagem compartilhada, os caminhos podem variar um pouco, mas a regra é que `index.html` esteja na pasta-documento do domínio/subdomínio.

---

### 4) SPA, cache e HTTPS — `.htaccess` pronto
Crie/edite um arquivo `.htaccess` na raiz do site com o conteúdo abaixo.

```apache
# Forçar HTTPS (opcional, habilite após emitir SSL)
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Regras SPA (React): redireciona rotas desconhecidas para index.html
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache de longo prazo para assets estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/json "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresDefault "access plus 1 month"
</IfModule>

# Cabeçalhos de cache
<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|json|png|jpg|jpeg|gif|svg|webp|avif)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

# Compressão (GZIP/Brotli)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
  # Não comprimir imagens
  SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|webp|avif|svg)$ no-gzip dont-vary
</IfModule>
```

> Dica: Após alterações, **limpe o cache** do navegador e, se usar CDN/Cache Manager, limpe também lá.

---

### 5) Múltiplos sites e subdomínios
- A Hostinger permite vários sites/domínios (depende do plano). Para cada domínio:
  - Configure o **Domínio Adicional** ou **Subdomínio** no hPanel e escolha uma pasta-documento (ex.: `public_html/meulivro/`).
  - Faça upload do build desse projeto nessa pasta.
- Para manter organização, use uma pasta por site: `public_html/site1/`, `public_html/site2/`.

---

### 6) SSL e domínio
- Em **Segurança → SSL**, emita o certificado gratuito. Depois, habilite o redirect HTTPS no `.htaccess`.
- Aponte o domínio para a Hostinger via DNS do registrador (nameservers) ou A/AAAA para o IP do servidor da hospedagem.

---

### 7) Integração com backend (CORS)
- Certifique-se de que o backend (FastAPI) aceite o domínio do site em CORS.
- Como essa SPA usa `REACT_APP_BACKEND_URL`, defina essa variável antes do `yarn build`. Deploys estáticos não injetam variáveis em runtime.

---

### 8) Fluxo de trabalho sugerido
1. Coloque suas imagens em `public/images/` e ajuste os `src` no código (ou use CDN e URLs absolutas).
2. Teste em dev (`yarn start`), depois gere o build (`yarn build`).
3. Zip do conteúdo de `build/`, upload pelo File Manager, extrair na pasta do site.
4. Adicione/atualize `.htaccess` (acima). Emita SSL e ative redirecionamento para HTTPS.
5. Valide no Lighthouse: performance, acessibilidade, SEO.

---

### 9) Problemas comuns
- **Página branca em rotas**: faltou a regra SPA no `.htaccess`.
- **Imagens antigas**: cache agressivo — renomeie com versão (ex.: `capa.v2.webp`).
- **Sem HTTPS**: emita SSL e force redirect.
- **Variáveis de ambiente**: para CRA, precisam estar no build (refaça o `yarn build`).

---

### 10) Checklist de produção
- [ ] Domínio apontado e SSL ativo
- [ ] `.htaccess` com SPA + Cache + HTTPS
- [ ] Imagens otimizadas (WebP/AVIF) e versionadas
- [ ] `REACT_APP_BACKEND_URL` setado antes do build
- [ ] Testes de navegação e toasts no mobile/desktop

Se quiser, posso preparar um pacote `.zip` com o build e um `.htaccess` sob medida, e já ajustar os caminhos de imagem no código para `public/images/`.


