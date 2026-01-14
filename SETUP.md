# Setup Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Supabase** project (PostgreSQL managed by Supabase)
3. **MetaMask** or wallet with testnet tokens (for blockchain)
4. **AWS S3** or **Cloudinary** account (for file storage)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Required configurations:
- **Database** (Supabase): `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **JWT Secret**: `JWT_SECRET` for authentication
- **File Storage**: Either AWS S3 or Cloudinary credentials
- **Blockchain**: RPC URL, Private Key, and Contract Address

### 3. Set Up Database

Use Supabase SQL editor or migration tools to create the required tables
(`products`, `verifications`, `certificates`, `blockchain_records`, `users`)
based on the schema defined in `lib/database/models.ts`. Supabase manages the
PostgreSQL instance for you, so no local database setup is required.

### 4. Deploy Smart Contract

```bash
# Compile contracts
npm run compile-contracts

# Deploy to testnet (update network in hardhat.config.ts)
npm run deploy-contracts
```

After deployment, update `CONTRACT_ADDRESS` in your `.env` file.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Workflow Overview

1. **User Submission** (`/submit`): Users submit products with images
2. **Authenticator Review** (`/authenticator`): Authenticators verify products
3. **Certificate Creation**: System automatically creates certificates for authenticated products
4. **Blockchain Storage**: Hashes are stored on blockchain
5. **Public Verification** (`/verify`): Anyone can verify product authenticity

## Testing the System

1. Submit a product at `/submit`
2. Log in as authenticator at `/authenticator`
3. Verify the product (mark as authentic)
4. System will create certificate and store hash on blockchain
5. Verify the product at `/verify` using the hash or product ID

## Troubleshooting

### Database Connection Issues
- Ensure Supabase project is running
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Blockchain Issues
- Ensure you have testnet tokens in your wallet
- Check RPC URL is correct for your network
- Verify contract address is set correctly

### File Upload Issues
- Check AWS S3 bucket permissions or Cloudinary credentials
- Ensure bucket/cloud name is correct

## Next Steps

- Implement authentication (JWT/NextAuth)
- Add user registration/login
- Enhance UI/UX
- Add email notifications
- Implement cross-check rules/datasets
- Add analytics dashboard
