# CLAUDE.md

## Project

**Name:** Web3 Payment Gateway

A production-ready crypto payment gateway built with NestJS, TypeScript, Prisma, PostgreSQL, BullMQ, Redis, and Ethers.js.

The project is designed to demonstrate backend engineering and Web3 integration using modern architecture and best practices.

---

# Objective

Build a scalable backend that allows merchants to receive cryptocurrency payments and automatically verify blockchain transactions.

Features include:

- Merchant Authentication
- Invoice Management
- Wallet Management
- Blockchain Listener
- Payment Verification
- Webhook Delivery
- Queue Processing
- Admin Dashboard
- Monitoring
- API Documentation

---

# Tech Stack

Backend

- NestJS
- TypeScript
- Node.js 20

Database

- PostgreSQL
- Prisma ORM

Cache

- Redis

Queue

- BullMQ

Blockchain

- ethers.js v6

Authentication

- JWT
- Passport

Validation

- class-validator
- class-transformer

Documentation

- Swagger

Logging

- nestjs-pino

Testing

- Jest

---

# Architecture

Follow Clean Architecture with Domain Driven Design (DDD).

Layers:

Controller

↓

Service

↓

Repository

↓

Prisma

Business logic must NEVER be placed inside controllers.

Controllers only:

- Validate Request
- Call Service
- Return Response

---

# Folder Structure

src/

```
auth/
merchant/
invoice/
payment/
wallet/
blockchain/
webhook/
queue/
notification/
health/

common/
config/
prisma/
shared/
```

Each module should contain:

```
controller/
service/
repository/
dto/
entity/
interfaces/
validators/
```

---

# Coding Standards

Always use:

- TypeScript Strict Mode
- Dependency Injection
- SOLID Principles
- DRY
- KISS

Avoid:

- any
- duplicated code
- business logic in controllers
- static helper classes when services are more appropriate

---

# DTO Rules

Every request must use DTO.

Every DTO must use:

- class-validator
- class-transformer

Never accept raw request bodies.

---

# Error Handling

Use:

Global Exception Filter

Never expose stack traces.

Always return:

{
"success": false,
"message": "...",
"errors": []
}

---

# Response Format

Success

{
"success": true,
"message": "...",
"data": {}
}

Error

{
"success": false,
"message": "...",
"errors": []
}

---

# Authentication

Merchant Authentication

JWT Access Token

JWT Refresh Token

API Key for Merchant Integration

Never store plaintext secrets.

Always hash sensitive values.

---

# Database

Use Prisma.

Never write raw SQL unless necessary.

Use Transactions when modifying multiple tables.

---

# Logging

Use nestjs-pino.

Log:

- Incoming Request
- Errors
- Blockchain Events
- Webhook Delivery
- Queue Jobs

Never log:

- Private Keys
- JWT Tokens
- Secrets

---

# Blockchain

Use ethers.js v6.

Supported Networks

- Ethereum
- Polygon

Never hardcode:

RPC URLs

Private Keys

Wallet Addresses

Use environment variables.

---

# Queue

Use BullMQ.

Queues:

- Verify Payment
- Webhook
- Retry
- Notification

Never perform long-running tasks inside HTTP requests.

---

# Webhook

Webhook must support:

- Retry
- Signature Verification
- Delivery History

Always retry failed webhooks.

---

# Security

Enable:

Helmet

CORS

Rate Limiter

Compression

Validation Pipe

Never disable validation.

---

# Environment Variables

Required:

PORT

DATABASE_URL

REDIS_URL

JWT_SECRET

JWT_REFRESH_SECRET

RPC_URL

PRIVATE_KEY

PAYMENT_ADDRESS

---

# API Documentation

Every endpoint must include:

- Summary
- Description
- Request DTO
- Response DTO

Swagger should always be updated.

---

# Testing

Write unit tests for:

- Services
- Payment Verification
- Blockchain Listener

Integration tests for:

- Authentication
- Invoice
- Payment

---

# Git Convention

Branch

feature/...

bugfix/...

hotfix/...

Commit

feat:

fix:

refactor:

docs:

test:

style:

---

# Development Rules

Before adding a feature:

1. Create DTO
2. Create Service
3. Create Repository
4. Add Validation
5. Add Swagger
6. Add Unit Test

Never skip these steps.

---

# AI Instructions

When generating code:

- Follow NestJS best practices.
- Keep controllers thin.
- Keep services focused on business logic.
- Prefer dependency injection.
- Avoid code duplication.
- Use async/await consistently.
- Return typed responses.
- Keep functions small and readable.
- Explain architectural decisions when introducing new modules.
- If requirements are unclear, ask for clarification instead of making assumptions.
