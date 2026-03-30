# Guia Completo: Exibir e Publicar o Frontend com GitHub Actions

Este documento mostra, passo a passo, como configurar o repositório para build e deploy automático do frontend no GitHub Pages.

## 1. O que já foi implementado no projeto

Foram adicionados os arquivos e ajustes abaixo:

- `.github/workflows/frontend-ci.yml`
  - Valida instalação de dependências e build em `push` e `pull_request` para `main`.
- `.github/workflows/deploy-frontend-pages.yml`
  - Publica automaticamente no GitHub Pages em `push` para `main`.
  - Também permite execução manual via `workflow_dispatch`.
- `vite.config.ts`
  - Agora aceita `VITE_BASE_PATH`, essencial para publicar em `https://usuario.github.io/repositorio/`.
- `index.html`
  - Removido o link para `/index.css` inexistente, evitando erro 404 no ambiente publicado.

## 2. Pré-requisitos

- Repositório hospedado no GitHub.
- Branch principal definida como `main`.
- Projeto com `package-lock.json` versionado (já existe neste projeto).

Se sua branch principal não for `main` (por exemplo `master`), atualize os gatilhos `on.push.branches` e `on.pull_request.branches` nos dois workflows.

## 3. Subir os arquivos para o GitHub

No seu ambiente local:

```bash
git add .github/workflows vite.config.ts index.html docs/github-actions-frontend.md
git commit -m "ci: add frontend CI and GitHub Pages deploy workflow"
git push origin main
```

## 4. Configurar o GitHub Pages para usar Actions

No repositório no GitHub:

1. Acesse `Settings`.
2. Clique em `Pages`.
3. Em `Build and deployment`, selecione:
   - `Source`: `GitHub Actions`
4. Salve as configurações (se necessário).

## 5. Configurar secret da API (opcional, mas recomendado)

Se quiser que a funcionalidade de geração com Gemini funcione no ambiente publicado:

1. Acesse `Settings`.
2. Clique em `Secrets and variables` > `Actions`.
3. Clique em `New repository secret`.
4. Crie:
   - `Name`: `GEMINI_API_KEY`
   - `Secret`: sua chave Gemini válida

Observação:
- Sem esse secret, o site publica normalmente, mas a parte de geração por IA pode falhar em runtime.

## 6. Executar e acompanhar os workflows

Após `push` na `main`:

- O workflow **Frontend CI** roda primeiro para validar build.
- O workflow **Deploy Frontend to GitHub Pages** gera `dist/` e publica.

Para rodar manualmente:

1. Vá em `Actions`.
2. Abra `Deploy Frontend to GitHub Pages`.
3. Clique em `Run workflow`.

## 7. URL final de publicação

Depois do deploy concluído, a URL geralmente será:

- Repositório padrão: `https://<usuario>.github.io/<repositorio>/`
- Repositório `<usuario>.github.io`: `https://<usuario>.github.io/`

O workflow já calcula automaticamente o `VITE_BASE_PATH` para esses dois cenários.

## 8. Troubleshooting rápido

### Erro 404 em assets JS/CSS

Causa comum:
- Base path incorreto para GitHub Pages.

Correção:
- Confirmar que o workflow de deploy executou o passo `Define Vite base path`.
- Confirmar que o deploy foi feito pela workflow `deploy-frontend-pages.yml`.

### Deploy não inicia

Causa comum:
- `Pages` ainda configurado com branch em vez de `GitHub Actions`.

Correção:
- Em `Settings > Pages`, selecionar `Source: GitHub Actions`.

### Funcionalidade de IA não responde

Causa comum:
- Secret `GEMINI_API_KEY` ausente ou inválido.

Correção:
- Revisar `Settings > Secrets and variables > Actions`.

## 9. Estrutura dos workflows (resumo)

- `frontend-ci.yml`
  - Checkout
  - Setup Node 20 + cache npm
  - `npm ci`
  - `npm run build`

- `deploy-frontend-pages.yml`
  - Checkout
  - Setup Node 20 + cache npm
  - Setup GitHub Pages
  - Define `VITE_BASE_PATH` dinamicamente
  - `npm ci`
  - `npm run build`
  - Upload `dist`
  - Deploy com `actions/deploy-pages`

## 10. Observação de segurança

No estado atual, a chave de API é injetada em build para uso no frontend. Isso facilita MVP e demonstração, mas não é ideal para produção. Para produção real, mova chamadas à API para backend/proxy e mantenha a chave somente no servidor.
