# NestJS API — Keycloak PKCE

API REST com NestJS, TypeORM e SQLite integrada ao Keycloak para validação de tokens JWT via PKCE.

## Stack

- **NestJS** — framework backend
- **TypeORM** — ORM para mapeamento das entidades
- **better-sqlite3** — banco de dados local para estudo
- **passport-jwt + jwks-rsa** — validação do token JWT com chave pública do Keycloak

## Pré-requisitos

- Node.js LTS
- Keycloak rodando via Docker (ver `/docker` na raiz do projeto)

## Como rodar

```bash
npm install
npm run start:dev
```

API disponível em: http://localhost:3000

> ⚠️ O Keycloak precisa estar rodando antes de iniciar a API.

## Autenticação

Todos os endpoints são protegidos por JWT. O token é validado usando a chave pública do Keycloak via JWKS:
http://localhost:8080/realms/estudo/protocol/openid-connect/certs

Envie o token no header:
Authorization: Bearer <access_token>

## Endpoints

### Employees
| Método | Rota | Descrição | Regra |
|---|---|---|---|
| `POST` | `/employees` | Cria employee | Autenticado |
| `GET` | `/employees/:id` | Busca employee | Autenticado |
| `PATCH` | `/employees/:id` | Atualiza employee | Apenas o dono (email do token) |
| `PATCH` | `/employees/:id/assign-manager` | Atribui manager | Autenticado |

## Entidades
Employee
├── id
├── name
├── managerId (auto-referência)
└── contactInfo (OneToOne)
ContactInfo
├── id
├── phone
└── email
Meeting
├── id
├── topic
├── zoomUrl
└── attendees (ManyToMany → Employee)
Task
├── id
├── name
└── assignee (ManyToOne → Employee)

## Seed

Ao subir a aplicação, o seed é executado automaticamente se o banco estiver vazio:

| Dado | Detalhe |
|---|---|
| CEO | `ceo@example.com` |
| Manager | reporta ao CEO |
| Tasks | 2 tasks atribuídas ao Manager |
| Meetings | 2 meetings com CEO e Manager |

## Segurança

- Token validado localmente via chave pública RS256 do Keycloak
- Sem chamada ao Keycloak a cada request
- Regra de ownership no `PATCH` — usuário só altera o próprio employee