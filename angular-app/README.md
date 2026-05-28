# Angular App — Keycloak PKCE

Aplicação Angular 21 para estudo de autenticação OAuth2 com PKCE integrada ao Keycloak e consumindo a NestJS API.

## Sobre

Esta aplicação demonstra o fluxo completo de autenticação **Authorization Code Flow + PKCE**
sem client secret, usando a biblioteca `angular-oauth2-oidc`, com interceptor HTTP que envia
o token JWT automaticamente em todas as requisições para a API.

## Pré-requisitos

- Node.js LTS
- Angular CLI: `npm install -g @angular/cli`
- Keycloak rodando via Docker (ver `/docker` na raiz do projeto)
- NestJS API rodando (ver `/nestjs-api`)

## Como rodar

```bash
npm install
ng serve
```

Acesse: http://localhost:4200

> ⚠️ O Keycloak e a NestJS API precisam estar rodando antes.

## Páginas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Pública | Home sem autenticação |
| `/dashboard` | Protegida | Busca employees na API com token automático |
| `/profile` | Protegida | Exibe dados completos do token JWT |

## Estrutura relevante
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.config.ts       # Configuração do Keycloak/PKCE
│   │   ├── auth.guard.ts        # Proteção de rotas
│   │   └── auth.interceptor.ts  # Injeta token JWT em todas as requisições
│   └── services/
│       └── employee.service.ts  # Chamadas à NestJS API
├── pages/
│   ├── home/                    # Página pública
│   ├── dashboard/               # Busca employees na API
│   └── profile/                 # Dados do token JWT
├── app.config.ts                # Providers da aplicação
└── app.routes.ts                # Definição de rotas

## Fluxo PKCE resumido

1. `initCodeFlow()` → gera `code_verifier` + `code_challenge` e redireciona ao Keycloak
2. Keycloak autentica e retorna `code`
3. Angular troca `code` + `code_verifier` pelo token JWT
4. `authGuard` valida o token antes de ativar rotas protegidas
5. `authInterceptor` injeta o token automaticamente em todas as chamadas HTTP

## Credenciais de teste

| Usuário | Senha |
|---|---|
| `user@estudo.com` | `user123` |