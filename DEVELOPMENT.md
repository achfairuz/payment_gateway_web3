# Development Checklist

Urutan pengerjaan fitur dari awal sampai selesai.
Centang setiap item setelah selesai dikerjakan.

> Detail teknis setiap phase (konsep, flow, struktur file, contoh kode) ada di [ROADMAP.md](ROADMAP.md).

---

## Phase 1 — Foundation

> Dasar dari semua module. Harus selesai sebelum apapun dikerjakan.

- [ ] Install dependency tambahan: `@nestjs/config`, `nestjs-pino`, `@nestjs/swagger`
- [ ] Setup `ConfigModule` global di `app.module.ts`
- [ ] Buat `PrismaService` di `src/prisma/`
- [ ] Finalisasi Prisma schema (semua model & enum)
- [ ] Jalankan `npx prisma migrate dev --name init`
- [ ] Buat `GlobalExceptionFilter` — format error response seragam
- [ ] Buat `ResponseInterceptor` — format success response seragam
- [ ] Daftarkan filter & interceptor secara global di `main.ts`
- [ ] Setup Swagger di `main.ts`
- [ ] Setup nestjs-pino logger di `main.ts`
- [ ] Verifikasi server bisa jalan: `npm run start:dev`

---

## Phase 2 — Auth Module

> Harus selesai sebelum module lain karena semua endpoint butuh proteksi.

- [ ] Buat `AuthModule`, `AuthController`, `AuthService`, `AuthRepository`
- [ ] `POST /auth/register` — daftar merchant baru
- [ ] `POST /auth/login` — login, return access token + refresh token
- [ ] `POST /auth/refresh` — perbarui access token
- [ ] `POST /auth/logout` — invalidate refresh token
- [ ] Buat `JwtStrategy` dan `JwtRefreshStrategy`
- [ ] Buat `JwtGuard` dan `JwtRefreshGuard`
- [ ] Hash password dengan bcrypt sebelum simpan
- [ ] Simpan refresh token ke DB, hapus saat logout
- [ ] Tambah Swagger decorator di semua endpoint auth
- [ ] Unit test `AuthService`

---

## Phase 3 — Merchant Module

> Identitas merchant harus ada sebelum invoice & wallet bisa dibuat.

- [ ] Buat `MerchantModule`, `MerchantController`, `MerchantService`, `MerchantRepository`
- [ ] `GET /merchant/me` — ambil profil merchant yang sedang login
- [ ] `PATCH /merchant/me` — update nama / info profil
- [ ] `POST /merchant/api-keys` — generate API Key baru
- [ ] `GET /merchant/api-keys` — list semua API Key
- [ ] `DELETE /merchant/api-keys/:id` — revoke API Key
- [ ] Buat `ApiKeyStrategy` dan `ApiKeyGuard`
- [ ] Hash API Key sebelum simpan ke DB
- [ ] Tambah Swagger decorator
- [ ] Unit test `MerchantService`

---

## Phase 4 — Wallet Module

> Invoice butuh wallet address sebagai tujuan pembayaran.

- [ ] Buat `WalletModule`, `WalletController`, `WalletService`, `WalletRepository`
- [ ] `POST /wallets` — generate wallet address baru (via ethers.js)
- [ ] `GET /wallets` — list wallet milik merchant
- [ ] `GET /wallets/:id` — detail satu wallet
- [ ] Enkripsi private key sebelum simpan ke DB (jangan plaintext)
- [ ] Support multi-network: Ethereum & Polygon
- [ ] Tambah Swagger decorator
- [ ] Unit test `WalletService`

---

## Phase 5 — Invoice Module

> Payment butuh invoice yang sudah ada terlebih dahulu.

- [ ] Buat `InvoiceModule`, `InvoiceController`, `InvoiceService`, `InvoiceRepository`
- [ ] `POST /invoices` — buat invoice baru (amount, currency, expiry)
- [ ] `GET /invoices` — list invoice merchant (pagination + filter by status)
- [ ] `GET /invoices/:id` — detail invoice
- [ ] `PATCH /invoices/:id/cancel` — cancel invoice yang masih PENDING
- [ ] Generate `invoiceId` unik yang bisa dikonversi ke `bytes32` untuk contract
- [ ] Auto-expire invoice via `@nestjs/schedule` cron job
- [ ] Tambah Swagger decorator
- [ ] Unit test `InvoiceService`

---

## Phase 6 — Blockchain Listener

> Inti integrasi Web3 — dengarkan event dari smart contract.

- [ ] Install `ethers` jika belum ada
- [ ] Buat `BlockchainModule`, `BlockchainService`, `EventListenerService`
- [ ] Setup `WebSocketProvider` untuk Ethereum & Polygon
- [ ] Compile `PaymentGateway.sol` → extract ABI ke `src/blockchain/abi/PaymentGateway.json`
- [ ] Connect ke contract menggunakan ABI + Contract Address
- [ ] Listen event `PaymentReceived` dari contract
- [ ] Handle reconnect otomatis jika WebSocket putus
- [ ] Saat event diterima → push job ke BullMQ `verify-payment` queue
- [ ] Unit test `EventListenerService`

---

## Phase 7 — Payment Verification

> Proses dan verifikasi transaksi yang diterima dari blockchain listener.

- [ ] Buat `PaymentModule`, `PaymentController`, `PaymentService`, `PaymentRepository`
- [ ] `GET /payments` — list payment (merchant hanya lihat miliknya)
- [ ] `GET /payments/:txHash` — detail satu payment
- [ ] Buat `PaymentVerificationService`:
  - Ambil transaction receipt dari provider
  - Verifikasi amount, address, dan status tx
  - Pastikan sudah cukup confirmation blocks (min. 12)
  - Idempotency check — jika txHash sudah ada di DB, skip
- [ ] Update status invoice → `PAID` setelah verifikasi sukses
- [ ] Simpan data payment ke DB
- [ ] Unit test `PaymentVerificationService`

---

## Phase 8 — Queue (BullMQ)

> Semua task berat dijalankan di luar HTTP request cycle.

- [ ] Install `@nestjs/bullmq`, `bullmq`, `ioredis`
- [ ] Buat `QueueModule` dengan koneksi ke Redis
- [ ] Processor `VerifyPaymentProcessor` — konsumsi queue `verify-payment`
- [ ] Processor `WebhookProcessor` — konsumsi queue `webhook`
- [ ] Processor `NotificationProcessor` — konsumsi queue `notification`
- [ ] Retry dengan exponential backoff (1s → 2s → 4s → 8s → 16s)
- [ ] Setup Bull Board di `/admin/queues` untuk monitoring job
- [ ] Unit test processor

---

## Phase 9 — Webhook Delivery

> Notifikasi real-time ke endpoint merchant setelah payment dikonfirmasi.

- [ ] Buat `WebhookModule`, `WebhookController`, `WebhookService`, `WebhookRepository`
- [ ] `POST /webhooks` — register webhook endpoint
- [ ] `GET /webhooks` — list webhook merchant
- [ ] `DELETE /webhooks/:id` — hapus webhook
- [ ] `GET /webhooks/:id/deliveries` — history pengiriman
- [ ] Sign payload dengan HMAC-SHA256 menggunakan `webhook.secret`
- [ ] Kirim `X-Signature` di header setiap request webhook
- [ ] Retry otomatis jika delivery gagal (max 5x)
- [ ] Simpan setiap percobaan di tabel `WebhookDelivery`
- [ ] Unit test `WebhookService`

---

## Phase 10 — Admin Dashboard

> Endpoint khusus admin untuk monitoring dan manajemen.

- [ ] Buat `AdminModule`, `AdminController`, `AdminService`
- [ ] Buat `AdminGuard` — hanya merchant dengan role ADMIN yang bisa akses
- [ ] `GET /admin/merchants` — list semua merchant + status
- [ ] `PATCH /admin/merchants/:id/suspend` — suspend merchant
- [ ] `GET /admin/payments` — semua payment di semua merchant
- [ ] `GET /admin/stats` — total volume, jumlah invoice, jumlah merchant aktif
- [ ] Tambah Swagger decorator dengan tag `Admin`

---

## Phase 11 — Health & Monitoring

> Pastikan sistem bisa dimonitor dan alerting bisa dipasang.

- [ ] Install `@nestjs/terminus`
- [ ] `GET /health` — cek status: DB, Redis, Blockchain RPC
- [ ] Setup nestjs-pino dengan format JSON (siap untuk log aggregator)
- [ ] Tambah correlation ID di setiap request log
- [ ] Log alert jika blockchain listener disconnect

---

## Phase 12 — Testing

> Validasi semua yang sudah dibangun.

- [ ] Unit test: `AuthService`
- [ ] Unit test: `InvoiceService`
- [ ] Unit test: `PaymentVerificationService`
- [ ] Unit test: `WebhookService`
- [ ] Unit test: `EventListenerService`
- [ ] Integration test: auth flow (register → login → refresh → logout)
- [ ] Integration test: invoice → payment flow
- [ ] E2E test: full payment cycle (buat invoice → bayar → webhook terkirim)
- [ ] Coverage minimal 80%

---

## Status Overview

| Phase | Module | Status |
|-------|--------|--------|
| 1 | Foundation | ⬜ Belum |
| 2 | Auth | ⬜ Belum |
| 3 | Merchant | ⬜ Belum |
| 4 | Wallet | ⬜ Belum |
| 5 | Invoice | ⬜ Belum |
| 6 | Blockchain Listener | ⬜ Belum |
| 7 | Payment Verification | ⬜ Belum |
| 8 | Queue (BullMQ) | ⬜ Belum |
| 9 | Webhook | ⬜ Belum |
| 10 | Admin | ⬜ Belum |
| 11 | Health & Monitoring | ⬜ Belum |
| 12 | Testing | ⬜ Belum |

> Update status ke ✅ setelah phase selesai.
