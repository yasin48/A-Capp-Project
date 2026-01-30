# Product Authentication System

A blockchain-based product authentication system that allows users to submit products for verification, authenticators to verify them, and creates immutable blockchain records for public verification.

## Features

1. **Ingestion Module**: User form to submit products with images and details
2. **Verification Module**: Authenticator dashboard to review and verify products
3. **Digital Certificate Creation**: Generate JSON certificates for authenticated products
4. **Blockchain Layer**: Store cryptographic hashes on Ethereum/Polygon blockchain
5. **Public Verification**: Public-facing page to verify product authenticity

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Express
- **Database**: PostgreSQL (Supabase)
- **Blockchain**: Ethereum/Polygon using Ethers.js
- **File Storage**: Supabase 
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 
- PostgreSQL(Supabase)
- MetaMask or wallet with testnet tokens
- Supabase for storage

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your configuration:
```bash
cp .env.example .env
```

4. Set up your database:
```bash
# For PostgreSQL
createdb product_auth_db

# Or use MongoDB connection string
```

5. Deploy the smart contract:
```bash
npm run compile-contracts
npm run deploy-contracts
```

6. Update `CONTRACT_ADDRESS` in `.env` with the deployed contract address

7. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── authenticator/     # Authenticator dashboard
│   └── verify/            # Public verification page
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── blockchain/       # Blockchain integration
│   ├── database/         # Database models
│   └── storage/          # File storage utilities
├── contracts/            # Solidity smart contracts
├── scripts/              # Deployment scripts
└── types/                # TypeScript type definitions
```

## Workflow

1. **User Submission**: Users submit products with images and details
2. **Authenticator Review**: Authenticators review and verify products
3. **Certificate Generation**: System generates JSON certificate for authenticated products
4. **Blockchain Storage**: Hash of certificate is stored on blockchain
5. **Public Verification**: Anyone can verify product authenticity using hash or product ID

## License

MIT
