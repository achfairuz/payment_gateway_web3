# Web3 Payment Gateway

![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_ORM-4169E1?logo=postgresql)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

Backend service untuk menerima pembayaran cryptocurrency secara otomatis. Merchant cukup buat invoice — sistem yang mengurus verifikasi transaksi di blockchain, update status, dan kirim webhook.

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| Merchant Auth | JWT Access + Refresh Token + API Key |
| Invoice Management | Buat, lacak, dan expire invoice otomatis |
| Wallet Management | Generate wallet address per merchant |
| Blockchain Listener | Listen event dari smart contract via ethers.js |
| Payment Verification | Verifikasi transaksi on-chain secara otomatis |
| Queue Processing | BullMQ untuk async task (tidak blocking HTTP) |
| Webhook Delivery | Notifikasi ke merchant + retry + HMAC signature |
| Admin Dashboard | Statistik merchant, payment, dan volume |
| API Documentation | Swagger UI di `/api/docs` |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | NestJS 11 + TypeScript |
| Runtime | Node.js 20 |
| Database | PostgreSQL + Prisma ORM v7 |
| Cache & Queue | Redis + BullMQ |
| Blockchain | ethers.js v6 |
| Smart Contract | Solidity 0.8.20 (EVM) |
| Auth | JWT + Passport.js + bcrypt |
| Validation | class-validator + class-transformer |
| Docs | Swagger / OpenAPI |
| Logging | nestjs-pino |
| Testing | Jest |

---

## Arsitektur

```
HTTP Request
     ↓
Controller          ← validasi input, return response
     ↓
Service             ← semua business logic di sini
     ↓
Repository          ← akses database
     ↓
Prisma ORM          ← query ke PostgreSQL
```

Pattern: **Clean Architecture + Domain Driven Design (DDD)**

---

## Struktur Folder

```
src/
├── auth/           # JWT, refresh token, API key auth
├── merchant/       # Profil & manajemen merchant
├── invoice/        # Buat & kelola invoice
├── payment/        # Verifikasi pembayaran
├── wallet/         # Generate & kelola wallet address
├── blockchain/     # ethers.js listener & provider
├── webhook/        # Delivery, retry, signature
├── queue/          # BullMQ processors & producers
├── notification/   # Event notifikasi internal
├── health/         # Health check endpoint
├── common/         # Filter, interceptor, decorator global
├── config/         # Environment config
├── prisma/         # Prisma service
└── shared/         # DTO, utils, types yang dipakai bersama

contracts/
└── PaymentGateway.sol  # Smart contract (Solidity)
```

---

## Cara Menjalankan

### Prasyarat

- Node.js 20+
- PostgreSQL (running)
- Redis (running)

### 1. Clone & install

```bash
git clone https://github.com/achfairuz/web3-payment-gateway.git
cd web3-payment-gateway
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Isi nilai di `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/web3_gateway
REDIS_URL=redis://localhost:6379
JWT_SECRET=<random 64 char string>
JWT_REFRESH_SECRET=<random 64 char string>
RPC_URL_ETHEREUM_WS=wss://mainnet.infura.io/ws/v3/YOUR_KEY
CONTRACT_ADDRESS=0x...
PAYMENT_ADDRESS=0x...
PRIVATE_KEY=<never commit this>
```

> Generate JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Migrate database

```bash
npx prisma migrate dev
```

### 4. Jalankan server

```bash
# Development
npm run start:dev

# Production
npm run build && npm run start:prod
```

---

## API Docs

Swagger tersedia di:

```
http://localhost:3000/api/docs
```

---

## Alur Pembayaran

```
[Merchant]  POST /invoices
               ↓
           Invoice dibuat + wallet address dikirim ke customer
               ↓
[Customer]  Bayar ke wallet address via blockchain
               ↓
[Contract]  emit PaymentReceived event
               ↓
[Backend]   ethers.js menangkap event → push ke BullMQ queue
               ↓
[Queue]     Processor verifikasi tx on-chain
               ↓
[Backend]   Update status invoice → kirim webhook
               ↓
[Merchant]  Terima notifikasi webhook
```

---

## Jaringan yang Didukung

- Ethereum Mainnet / Sepolia (testnet)
- Polygon Mainnet / Amoy (testnet)

---

## Format Response

```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "message": "...", "errors": [] }
```

---

## Testing

```bash
npm run test          # unit test
npm run test:cov      # coverage report
npm run test:e2e      # end-to-end test
```

---

## Dokumentasi Lanjutan

| Dokumen | Isi |
|---------|-----|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Checklist urutan pengerjaan fitur |
| [ROADMAP.md](ROADMAP.md) | Detail teknis setiap phase (konsep, flow, struktur file) |
| [contracts/README.md](contracts/README.md) | Smart contract & integrasi Solidity |
| [.env.example](.env.example) | Template semua environment variable |

---

## Keamanan

- Helmet + CORS + Rate Limiter aktif di semua endpoint
- Password & API Key di-hash sebelum disimpan (bcrypt)
- Private key tidak pernah disimpan plaintext
- Webhook menggunakan HMAC-SHA256 signature
- Stack trace tidak pernah dikembalikan ke client

---

## Lisensi

UNLICENSED — project portfolio & pembelajaran.

**Author:** achfairuz
