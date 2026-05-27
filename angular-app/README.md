# Angular App — Keycloak PKCE

Aplicação Angular 21 para estudo de autenticação OAuth2 com PKCE integrada ao Keycloak.

## Sobre

Esta aplicação demonstra o fluxo completo de autenticação **Authorization Code Flow + PKCE**
sem client secret, usando a biblioteca `angular-oauth2-oidc`.

## Pré-requisitos

- Node.js LTS
- Angular CLI: `npm install -g @angular/cli`
- Keycloak rodando via Docker (ver `/docker` na raiz do projeto)

## Como rodar

```bash
npm install
ng serve
```

Acesse: http://localhost:4200

> ⚠️ O Keycloak precisa estar rodando antes de fazer login.

## Páginas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Pública | Home sem autenticação |
| `/dashboard` | Protegida | Exibe usuário e email do token |
| `/profile` | Protegida | Exibe dados completos do token JWT |

## Estrutura relevante
src/app/
├── core/auth/
│   ├── auth.config.ts   # Configuração do Keycloak/PKCE
│   └── auth.guard.ts    # Proteção de rotas
├── pages/
│   ├── home/            # Página pública
│   ├── dashboard/       # Página protegida
│   └── profile/         # Página protegida
├── app.config.ts        # Providers da aplicação
└── app.routes.ts        # Definição de rotas

## Fluxo PKCE resumido

1. `initCodeFlow()` → gera `code_verifier` + `code_challenge` e redireciona ao Keycloak
2. Keycloak autentica e retorna `code`
3. Angular troca `code` + `code_verifier` pelo token JWT
4. `authGuard` valida o token antes de ativar rotas protegidas

## Credenciais de teste

| Usuário | Senha |
|---|---|
| `user@estudo.com` | `user123` |