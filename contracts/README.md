# Smart Contracts

Solidity contracts untuk Web3 Payment Gateway.

## Kontrak

### PaymentGateway.sol

Kontrak utama yang menangani pembayaran berbasis invoice.

**Fungsi utama:**

| Fungsi | Tipe | Deskripsi |
|--------|------|-----------|
| `pay(invoiceId, merchant)` | payable | Customer membayar invoice, kirim ETH ke kontrak |
| `withdraw()` | external | Merchant menarik balance yang terkumpul |
| `getPayment(invoiceId)` | view | Ambil detail pembayaran berdasarkan invoiceId |
| `getMerchantBalance(merchant)` | view | Cek balance merchant yang bisa ditarik |
| `isInvoicePaid(invoiceId)` | view | Cek apakah invoice sudah dibayar |

**Events (didengarkan oleh backend via ethers.js):**

| Event | Parameter | Kapan emit |
|-------|-----------|------------|
| `PaymentReceived` | invoiceId, payer, merchant, amount, timestamp | Setiap pembayaran berhasil |
| `Withdrawn` | merchant, amount | Setiap penarikan dana berhasil |

---

## Integrasi dengan Backend

Backend (NestJS) mendengarkan event dari kontrak ini menggunakan ethers.js:

```typescript
// Di blockchain.service.ts
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

contract.on('PaymentReceived', (invoiceId, payer, merchant, amount, timestamp) => {
  // 1. Update status invoice di database
  // 2. Push job ke BullMQ queue untuk verifikasi
  // 3. Kirim webhook ke merchant
});
```

---

## Setup Hardhat (untuk develop & deploy)

```bash
# Install Hardhat di root project
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Init Hardhat
npx hardhat init

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy ke testnet (Sepolia)
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## Flow Lengkap

```
Backend                    Contract                   Backend
   │                           │                         │
   │  Generate invoiceId       │                         │
   │  (string → bytes32)       │                         │
   │                           │                         │
Customer                       │                         │
   │  pay(invoiceId, merchant) │                         │
   │  + msg.value (ETH)        │                         │
   │──────────────────────────>│                         │
   │                           │  emit PaymentReceived   │
   │                           │────────────────────────>│
   │                           │                         │ verify & update DB
   │                           │                         │ send webhook
   │                           │                         │
Merchant                       │                         │
   │  withdraw()               │                         │
   │──────────────────────────>│                         │
   │  ← ETH transferred        │                         │
```

---

## Security Patterns yang Digunakan

- **CEI Pattern** (Checks-Effects-Interactions) — mencegah reentrancy attack
- **Zero address check** — via `validAddress` modifier
- **Low-level call** — `call{value}("")` lebih aman dari `transfer()`
- **State zeroed before transfer** — balance di-reset sebelum ETH dikirim
