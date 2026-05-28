# Keycloak + PKCE + Angular + NestJS — Projeto de Estudo

Template educacional para estudo de autenticação OAuth2 com PKCE usando Keycloak, Angular e NestJS.

## ⚠️ Aviso

Este projeto é **exclusivamente para fins de estudo local**.
**Nunca use estas credenciais ou configurações em produção.**

## Stack

- **Keycloak 26.2** — servidor de autenticação
- **PostgreSQL 16** — banco de dados do Keycloak
- **Angular 21** — aplicação frontend com PKCE
- **NestJS** — API REST protegida por JWT
- **SQLite** — banco de dados da API
- **angular-oauth2-oidc** — biblioteca OAuth2/PKCE
- **Docker + Docker Compose** — infraestrutura local

## Credenciais padrão

| Serviço | Usuário | Senha |
|---|---|---|
| Keycloak Admin | `admin` | `admin` |
| Usuário de teste | `user` / `user@estudo.com` | `user123` |
| PostgreSQL | `keycloak` | `keycloak` |

## Sobre as credenciais

### Keycloak Admin (`admin` / `admin`)
✅ **Criado automaticamente** ao subir o Docker Compose via variáveis do `.env`.

### Usuário de teste (`user` / `user123`)
✅ **Criado automaticamente** via `realm-export.json` importado pelo Keycloak na primeira vez que o container sobe.

> ⚠️ O export não inclui senha. Se o banco for zerado (`docker compose down -v`), o usuário será recriado **sem senha** e será necessário redefinir manualmente:
> 1. Acesse http://localhost:8080 → login com `admin` / `admin`
> 2. Realm `estudo` → **Users** → `user`
> 3. Aba **Credentials** → **Set password** → `user123` → Temporary: **Off**

## Pré-requisitos

- Windows 11 com WSL2
- [Rancher Desktop](https://rancherdesktop.io) com runtime `dockerd`
- [Node.js LTS](https://nodejs.org)
- [Angular CLI](https://angular.dev/cli): `npm install -g @angular/cli`

## Como rodar

### 1. Subir a infraestrutura (Keycloak + PostgreSQL)

```bash
cd docker
docker compose up -d
```

Aguarde o Keycloak inicializar e acesse:
- Keycloak Admin: http://localhost:8080 (`admin` / `admin`)

### 2. Rodar a NestJS API

```bash
cd nestjs-api
npm install
npm run start:dev
```

API disponível em: http://localhost:3000

### 3. Rodar a aplicação Angular

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
├── nestjs-api/                # API REST NestJS
└── README.md

## Fluxo PKCE

1. Angular gera `code_verifier` e `code_challenge`
2. Redireciona para o Keycloak com o challenge
3. Usuário faz login no Keycloak
4. Keycloak retorna `code` para o Angular
5. Angular troca `code` + `code_verifier` pelo token JWT
6. Interceptor HTTP injeta o token em todas as chamadas à API
7. NestJS valida o token via chave pública do Keycloak (RS256)

## Páginas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Pública | Home sem autenticação |
| `/dashboard` | Protegida | Busca employees na API com token automático |
| `/profile` | Protegida | Exibe dados completos do token JWT |

## Endpoints da API

| Método | Rota | Descrição | Regra |
|---|---|---|---|
| `GET` | `/employees/:id` | Busca employee | Autenticado |
| `POST` | `/employees` | Cria employee | Autenticado |
| `PATCH` | `/employees/:id` | Atualiza employee | Apenas o dono |
| `PATCH` | `/employees/:id/assign-manager` | Atribui manager | Autenticado |