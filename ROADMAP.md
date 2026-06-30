# Development Roadmap — Web3 Payment Gateway

Status project saat ini: **Fresh NestJS boilerplate** — belum ada modul apapun.

---

## Urutan Pengerjaan

```
Phase 1 → Foundation & Database Schema
Phase 2 → Auth (Merchant Register & Login)
Phase 3 → Merchant Profile & API Key
Phase 4 → Wallet Management
Phase 5 → Invoice Management
Phase 6 → Blockchain Listener (ethers.js)
Phase 7 → Payment Verification
Phase 8 → Queue Processing (BullMQ)
Phase 9 → Webhook Delivery
Phase 10 → Admin Dashboard
Phase 11 → Health & Monitoring
Phase 12 → Testing
```

> **Kenapa urutan ini?**
> Setiap phase bergantung pada phase sebelumnya.
> Auth harus ada sebelum Invoice. Invoice harus ada sebelum Payment. Payment harus ada sebelum Webhook.

---

## Phase 1 — Foundation & Database Schema

**Prioritas: PERTAMA — semua phase bergantung di sini**

### Yang dikerjakan

- [ ] Setup environment config (`@nestjs/config`)
- [ ] Global Exception Filter (format error response seragam)
- [ ] Global Response Interceptor (format success response seragam)
- [ ] Prisma Schema (desain semua tabel)
- [ ] Setup nestjs-pino logger
- [ ] Setup Swagger

### Prisma Schema (rancangan tabel)

```prisma
model Merchant {
  id           String     @id @default(cuid())
  email        String     @unique
  name         String
  passwordHash String
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  apiKeys      ApiKey[]
  wallets      Wallet[]
  invoices     Invoice[]
  webhooks     Webhook[]
}

model ApiKey {
  id         String   @id @default(cuid())
  key        String   @unique
  name       String
  merchantId String
  merchant   Merchant @relation(fields: [merchantId], references: [id])
  isActive   Boolean  @default(true)
  lastUsedAt DateTime?
  createdAt  DateTime @default(now())
}

model RefreshToken {
  id         String   @id @default(cuid())
  token      String   @unique
  merchantId String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}

model Wallet {
  id         String   @id @default(cuid())
  address    String   @unique
  network    String   // ethereum | polygon
  merchantId String
  merchant   Merchant @relation(fields: [merchantId], references: [id])
  createdAt  DateTime @default(now())
}

model Invoice {
  id          String        @id @default(cuid())
  invoiceId   String        @unique  // bytes32 untuk contract
  amount      Decimal
  currency    String        // ETH | MATIC | USDT
  status      InvoiceStatus @default(PENDING)
  expiresAt   DateTime
  merchantId  String
  merchant    Merchant      @relation(fields: [merchantId], references: [id])
  payment     Payment?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum InvoiceStatus {
  PENDING
  PAID
  EXPIRED
  CANCELLED
}

model Payment {
  id          String   @id @default(cuid())
  invoiceId   String   @unique
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  txHash      String   @unique
  payer       String   // wallet address customer
  amount      Decimal
  network     String
  blockNumber Int
  confirmedAt DateTime
  createdAt   DateTime @default(now())
}

model Webhook {
  id         String          @id @default(cuid())
  url        String
  secret     String          // untuk HMAC signature
  events     String[]        // ["payment.received", "payment.confirmed"]
  isActive   Boolean         @default(true)
  merchantId String
  merchant   Merchant        @relation(fields: [merchantId], references: [id])
  deliveries WebhookDelivery[]
  createdAt  DateTime        @default(now())
}

model WebhookDelivery {
  id           String   @id @default(cuid())
  webhookId    String
  webhook      Webhook  @relation(fields: [webhookId], references: [id])
  event        String
  payload      Json
  statusCode   Int?
  response     String?
  attemptCount Int      @default(0)
  success      Boolean  @default(false)
  deliveredAt  DateTime?
  createdAt    DateTime @default(now())
}
```

### Konsep yang dipelajari
- Prisma schema: model, relation, enum
- NestJS Exception Filter
- NestJS Interceptor
- Environment config dengan validation

---

## Phase 2 — Auth Module

**Prioritas: KEDUA — semua endpoint butuh auth**

### Yang dikerjakan

- [ ] `POST /auth/register` — Merchant daftar
- [ ] `POST /auth/login` — Merchant login, dapat access + refresh token
- [ ] `POST /auth/refresh` — Perbarui access token
- [ ] `POST /auth/logout` — Invalidate refresh token
- [ ] JWT Guard (proteksi endpoint)
- [ ] Password hashing dengan bcrypt

### Struktur file

```
src/auth/
├── auth.module.ts
├── controller/
│   └── auth.controller.ts
├── service/
│   └── auth.service.ts
├── repository/
│   └── auth.repository.ts
├── dto/
│   ├── register.dto.ts
│   └── login.dto.ts
├── guards/
│   ├── jwt.guard.ts
│   └── jwt-refresh.guard.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── jwt-refresh.strategy.ts
└── interfaces/
    └── jwt-payload.interface.ts
```

### Konsep yang dipelajari
- JWT (access token & refresh token, kenapa perlu dua)
- Passport.js + NestJS integration
- bcrypt hashing
- Guard vs Middleware di NestJS
- Refresh token rotation

### Flow Auth

```
Register:
POST /auth/register → hash password → simpan merchant → return merchant data

Login:
POST /auth/login → verifikasi password → generate access token (15m) +
                   refresh token (7d) → simpan refresh token di DB

Refresh:
POST /auth/refresh → verifikasi refresh token → generate access token baru

Logout:
POST /auth/logout → hapus refresh token dari DB
```

---

## Phase 3 — Merchant Module

**Setelah auth selesai**

### Yang dikerjakan

- [ ] `GET /merchant/me` — Ambil profil merchant
- [ ] `PATCH /merchant/me` — Update profil
- [ ] `POST /merchant/api-keys` — Generate API Key baru
- [ ] `GET /merchant/api-keys` — List API Keys
- [ ] `DELETE /merchant/api-keys/:id` — Revoke API Key
- [ ] API Key Guard (untuk integrasi merchant ke sistem mereka)

### Konsep yang dipelajari
- Generate random string aman (`crypto.randomBytes`)
- Hash API Key sebelum simpan ke DB (sama seperti password)
- Multiple auth strategies (JWT untuk dashboard, API Key untuk integrasi)

---

## Phase 4 — Wallet Module

**Setelah Merchant selesai**

### Yang dikerjakan

- [ ] `POST /wallets` — Generate wallet address baru untuk merchant
- [ ] `GET /wallets` — List wallet merchant
- [ ] Integrasi ethers.js untuk generate wallet

### Konsep yang dipelajari
- `ethers.Wallet.createRandom()` — generate wallet
- Enkripsi private key sebelum simpan (jangan simpan plaintext)
- HD Wallet (satu seed phrase → banyak address)

### Penting
Private key **tidak boleh** disimpan plaintext. Gunakan enkripsi AES atau simpan di vault (HashiCorp Vault / AWS KMS untuk production).

---

## Phase 5 — Invoice Module

**Setelah Wallet selesai**

### Yang dikerjakan

- [ ] `POST /invoices` — Buat invoice baru
- [ ] `GET /invoices` — List invoice merchant (dengan pagination & filter)
- [ ] `GET /invoices/:id` — Detail invoice
- [ ] `PATCH /invoices/:id/cancel` — Cancel invoice
- [ ] Auto-expire invoice via scheduled job

### Konsep yang dipelajari
- UUID / CUID untuk ID
- Konversi string invoiceId → bytes32 (untuk Solidity contract)
- Pagination dengan Prisma (`skip`, `take`, `cursor`)
- Scheduled tasks dengan `@nestjs/schedule`

### Convert invoiceId untuk Contract

```typescript
// Backend generate invoiceId sebagai string
const invoiceId = cuid(); // "clxyz123..."

// Konversi ke bytes32 untuk dikirim ke contract
const bytes32Id = ethers.encodeBytes32String(invoiceId);
// → "0x636c78797a313233..."
```

---

## Phase 6 — Blockchain Listener

**Inti dari Web3 integration**

### Yang dikerjakan

- [ ] Setup ethers.js Provider (Ethereum + Polygon)
- [ ] Connect ke `PaymentGateway.sol` contract
- [ ] Listen event `PaymentReceived` dari contract
- [ ] Handle reconnect jika koneksi WebSocket putus
- [ ] Push job ke BullMQ ketika event diterima

### Struktur file

```
src/blockchain/
├── blockchain.module.ts
├── service/
│   ├── blockchain.service.ts      ← setup provider & contract
│   └── event-listener.service.ts  ← listen events
├── interfaces/
│   └── payment-event.interface.ts
└── abi/
    └── PaymentGateway.json        ← ABI dari compiled contract
```

### Konsep yang dipelajari
- ABI (Application Binary Interface) — "kontrak" antara JS dan Solidity
- WebSocket Provider vs HTTP Provider
- `contract.on('EventName', callback)` dengan ethers.js
- Event filtering berdasarkan block number
- Reconnect strategy untuk WebSocket

### Cara Listen Event

```typescript
const provider = new ethers.WebSocketProvider(process.env.RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

contract.on('PaymentReceived', (invoiceId, payer, merchant, amount, timestamp, event) => {
  // Push ke BullMQ queue untuk diproses async
  this.paymentQueue.add('verify-payment', {
    invoiceId,
    txHash: event.log.transactionHash,
    blockNumber: event.log.blockNumber,
    amount: ethers.formatEther(amount),
  });
});
```

---

## Phase 7 — Payment Verification

**Setelah Blockchain Listener selesai**

### Yang dikerjakan

- [ ] `GET /payments` — List payment (admin/merchant)
- [ ] `GET /payments/:txHash` — Detail payment
- [ ] Service untuk verifikasi transaksi on-chain
- [ ] Update status invoice setelah payment dikonfirmasi
- [ ] Minimal confirmation blocks (misal: tunggu 12 blok)

### Konsep yang dipelajari
- `provider.getTransactionReceipt()` — verifikasi tx berhasil
- Confirmation blocks — berapa blok harus lewat sebelum dianggap final
- Idempotency — jika event diterima dua kali, jangan proses dua kali

---

## Phase 8 — Queue Processing (BullMQ)

**Dibangun paralel dengan Phase 6 & 7**

### Yang dikerjakan

- [ ] Setup Redis + BullMQ
- [ ] `verify-payment` queue + processor
- [ ] `webhook` queue + processor
- [ ] `retry` queue + processor (exponential backoff)
- [ ] `notification` queue + processor
- [ ] Bull Board (UI untuk monitor queue)

### Struktur file

```
src/queue/
├── queue.module.ts
├── processors/
│   ├── verify-payment.processor.ts
│   ├── webhook.processor.ts
│   └── notification.processor.ts
└── producers/
    ├── payment.producer.ts
    └── webhook.producer.ts
```

### Konsep yang dipelajari
- Kenapa queue? — HTTP request tidak boleh tunggu blockchain confirmation
- BullMQ: job, worker, queue, repeatable jobs
- Exponential backoff untuk retry (1s → 2s → 4s → 8s)
- Dead letter queue — job yang gagal terus

---

## Phase 9 — Webhook Delivery

**Setelah Queue selesai**

### Yang dikerjakan

- [ ] `POST /webhooks` — Register webhook endpoint
- [ ] `GET /webhooks` — List webhooks
- [ ] `DELETE /webhooks/:id` — Hapus webhook
- [ ] `GET /webhooks/:id/deliveries` — History pengiriman
- [ ] HMAC signature untuk verifikasi di sisi merchant
- [ ] Retry otomatis jika gagal (max 5x)

### Konsep yang dipelajari
- HMAC-SHA256 signature
- Idempotency key untuk webhook
- Retry dengan exponential backoff
- Webhook delivery tracking

### HMAC Signature

```typescript
// Backend sign payload
const signature = crypto
  .createHmac('sha256', webhook.secret)
  .update(JSON.stringify(payload))
  .digest('hex');

// Kirim di header
headers['X-Signature'] = `sha256=${signature}`;

// Merchant verifikasi di sisi mereka
const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
const isValid = timingSafeEqual(Buffer.from(received), Buffer.from(expected));
```

---

## Phase 10 — Admin Dashboard

**Setelah semua fitur utama selesai**

### Yang dikerjakan

- [ ] `GET /admin/merchants` — List semua merchant
- [ ] `GET /admin/payments` — Semua payment
- [ ] `GET /admin/stats` — Statistik: total volume, jumlah invoice, dll
- [ ] `PATCH /admin/merchants/:id/suspend` — Suspend merchant
- [ ] Admin role & guard

---

## Phase 11 — Health & Monitoring

### Yang dikerjakan

- [ ] `GET /health` — Health check (DB, Redis, Blockchain RPC)
- [ ] Setup nestjs-pino dengan format JSON
- [ ] Log correlation ID per request
- [ ] Alert jika blockchain listener disconnect

---

## Phase 12 — Testing

### Yang dikerjakan

- [ ] Unit test: AuthService, InvoiceService, PaymentService
- [ ] Unit test: Blockchain event handler
- [ ] Integration test: Auth flow (register → login → refresh → logout)
- [ ] Integration test: Invoice → Payment flow
- [ ] E2E test: Full payment cycle

---

## Ringkasan Prioritas

| Urutan | Phase | Alasan |
|--------|-------|--------|
| 1 | Foundation + DB Schema | Semua butuh ini |
| 2 | Auth | Semua endpoint butuh proteksi |
| 3 | Merchant + API Key | Identitas merchant harus ada |
| 4 | Wallet | Invoice butuh wallet address |
| 5 | Invoice | Payment butuh invoice |
| 6 | Blockchain Listener | Dengarkan event dari contract |
| 7 | Payment Verification | Proses event yang diterima |
| 8 | Queue (BullMQ) | Async processing untuk phase 6 & 7 |
| 9 | Webhook | Notifikasi ke merchant |
| 10 | Admin | Fitur tambahan, bukan blocker |
| 11 | Health & Monitoring | Maintenance & observability |
| 12 | Testing | Validasi semua yang sudah dibuat |

---

## Dependency Antar Phase

```
[1. Foundation]
      ↓
[2. Auth] ──────────────────────────────────┐
      ↓                                      │
[3. Merchant]                                │
      ↓                                      │
[4. Wallet]                                  │
      ↓                                      ↓
[5. Invoice] ──→ [6. Blockchain] ──→ [7. Payment] ──→ [9. Webhook]
                        ↓                  ↓
                  [8. Queue BullMQ] ←──────┘
                        ↓
                 [10. Admin Dashboard]
                        ↓
               [11. Health & Monitoring]
                        ↓
                   [12. Testing]
```

---

## Mulai Dari Mana Sekarang?

**Phase 1 — Step pertama:**

1. Desain dan finalisasi Prisma schema
2. Jalankan `npx prisma migrate dev --name init`
3. Buat Global Exception Filter
4. Buat Global Response Interceptor
5. Setup Swagger di `main.ts`

Setelah itu baru masuk ke Phase 2 (Auth).
