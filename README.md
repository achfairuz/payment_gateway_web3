# Web3 Payment Gateway

A production-ready cryptocurrency payment gateway built with NestJS, TypeScript, Prisma, PostgreSQL, BullMQ, Redis, and Ethers.js.

Designed to demonstrate backend engineering and Web3 integration using Clean Architecture, Domain Driven Design, and modern best practices.

---

## Features

- Merchant authentication (JWT + API Key)
- Invoice creation and management
- Wallet management
- Blockchain event listener (Ethereum & Polygon)
- Automatic payment verification via ethers.js
- Webhook delivery with retry and signature verification
- Queue-based async processing with BullMQ
- Admin dashboard endpoints
- Health checks and monitoring
- Swagger API documentation

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | NestJS + TypeScript                 |
| Runtime      | Node.js 20                          |
| Database     | PostgreSQL + Prisma ORM             |
| Cache        | Redis                               |
| Queue        | BullMQ                              |
| Blockchain   | ethers.js v6                        |
| Auth         | JWT (Access + Refresh) + API Key    |
| Validation   | class-validator + class-transformer |
| Docs         | Swagger                             |
| Logging      | nestjs-pino                         |
| Testing      | Jest                                |

---

## Architecture

```
Controller  →  Service  →  Repository  →  Prisma
```

Follows **Clean Architecture** with **Domain Driven Design (DDD)**.

- Controllers: validate request, call service, return response
- Services: all business logic lives here
- Repositories: database access layer

---

## Folder Structure

```
src/
├── auth/               # JWT & API key authentication
├── merchant/           # Merchant registration & profile
├── invoice/            # Invoice creation & management
├── payment/            # Payment verification
├── wallet/             # Wallet management
├── blockchain/         # ethers.js listener & transaction checks
├── webhook/            # Webhook delivery & retry
├── queue/              # BullMQ queue definitions & processors
├── notification/       # Notification events
├── health/             # Health check endpoints
├── common/             # Global filters, interceptors, decorators
├── config/             # Environment config
├── prisma/             # Prisma service
└── shared/             # Shared DTOs, utils, types
```

Each module contains:

```
module/
├── controller/
├── service/
├── repository/
├── dto/
├── entity/
├── interfaces/
└── validators/
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- npm

### 1. Clone the repository

```bash
git clone https://github.com/achfairuz/web3-payment-gateway.git
cd web3-payment-gateway
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/web3_gateway

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Blockchain
RPC_URL_ETHEREUM=https://mainnet.infura.io/v3/YOUR_KEY
RPC_URL_POLYGON=https://polygon-mainnet.infura.io/v3/YOUR_KEY
PAYMENT_ADDRESS=0xYourWalletAddress

# Never commit private keys
PRIVATE_KEY=your_private_key
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

---

## Payment Flow

```
Merchant                 Backend                    Blockchain
   │                        │                           │
   │  POST /invoices         │                           │
   │───────────────────────>│                           │
   │  ← invoice + address   │                           │
   │                        │                           │
Customer pays to address   │                           │
   │                        │  Listen for tx event      │
   │                        │<─────────────────────────│
   │                        │  Verify tx on-chain       │
   │                        │──────────────────────────>│
   │                        │  ← confirmed              │
   │                        │                           │
   │  Webhook delivered     │                           │
   │<───────────────────────│                           │
```

---

## Queue Architecture

| Queue           | Purpose                                |
|-----------------|----------------------------------------|
| verify-payment  | Verify incoming blockchain transactions |
| webhook         | Deliver webhooks to merchant endpoints  |
| retry           | Retry failed webhook deliveries         |
| notification    | Send internal notifications             |

Long-running tasks are never processed inside HTTP requests.

---

## Supported Networks

- Ethereum (Mainnet / Sepolia)
- Polygon (Mainnet / Amoy)

---

## Security

- Helmet (HTTP headers)
- CORS
- Rate limiting
- Input validation via class-validator
- Webhook HMAC signature verification
- Hashed secrets — no plaintext storage
- No stack traces exposed in responses

---

## Response Format

**Success**
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

---

## Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Git Convention

**Branches**

```
feature/...
bugfix/...
hotfix/...
```

**Commits**

```
feat:     new feature
fix:      bug fix
refactor: code refactoring
docs:     documentation
test:     tests
style:    formatting
```

---

## License

UNLICENSED — private project for portfolio and learning purposes.

---

## Author

**achfairuz**
