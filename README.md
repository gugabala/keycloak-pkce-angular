# Keycloak + PKCE + Angular — Projeto de Estudo

Template educacional para estudo de autenticação OAuth2 com PKCE usando Keycloak e Angular.

## ⚠️ Aviso

Este projeto é **exclusivamente para fins de estudo local**.
**Nunca use estas credenciais ou configurações em produção.**

## Stack

- **Keycloak 26.2** — servidor de autenticação
- **PostgreSQL 16** — banco de dados do Keycloak
- **Angular 21** — aplicação frontend
- **angular-oauth2-oidc** — biblioteca OAuth2/PKCE
- **Docker + Docker Compose** — infraestrutura local

## Credenciais padrão

| Serviço | Usuário | Senha |
|---|---|---|
| Keycloak Admin | `admin` | `admin` |
| Usuário de teste | `user@estudo.com` / `user` | `user123` |
| PostgreSQL | `keycloak` | `keycloak` |

## Pré-requisitos

- Windows 11 com WSL2
- [Rancher Desktop](https://rancherdesktop.io) com runtime `dockerd`
- [Node.js LTS](https://nodejs.org)
- [Angular CLI](https://angular.dev/cli): `npm install -g @angular/cli`

## Como rodar

### 1. Subir a infraestrutura

```bash
cd docker
docker compose up -d
```

Aguarde o Keycloak inicializar e acesse:
- Keycloak Admin: http://localhost:8080 (`admin` / `admin`)

### 2. Rodar a aplicação Angular

```bash
cd angular-app
npm install
ng serve
```

Acesse: http://localhost:4200

## Estrutura do projeto

├── docker/
│   ├── docker-compose.yml     # Keycloak + PostgreSQL
│   ├── .env                   # Credenciais padrão (apenas estudo)
│   └── keycloak/
│       └── realm-export.json  # Realm pré-configurado com PKCE
├── angular-app/               # Aplicação Angular
└── README.md

## Fluxo PKCE

1. Angular gera `code_verifier` e `code_challenge`
2. Redireciona para o Keycloak com o challenge
3. Usuário faz login no Keycloak
4. Keycloak retorna `code` para o Angular
5. Angular troca `code` + `code_verifier` pelo token JWT
6. Token usado para acessar páginas protegidas

## Páginas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Pública | Home sem autenticação |
| `/dashboard` | Protegida | Exibe usuário e email do token |
| `/profile` | Protegida | Exibe dados completos do token |