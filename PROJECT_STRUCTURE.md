# Project Structure

```
product-authentication-system/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── products/
│   │   │   ├── submit/           # Product submission endpoint
│   │   │   └── route.ts          # Get user products
│   │   ├── verification/
│   │   │   ├── pending/          # Get pending products
│   │   │   └── verify/            # Verify product endpoint
│   │   ├── certificates/
│   │   │   └── create/            # Create certificate endpoint
│   │   ├── blockchain/
│   │   │   └── store/             # Store hash on blockchain
│   │   └── verify/                # Public verification endpoint
│   ├── submit/                    # Product submission page
│   ├── dashboard/                 # User dashboard
│   ├── authenticator/             # Authenticator dashboard
│   ├── verify/                    # Public verification page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
│
├── components/                    # React components
│   └── ProductSubmissionForm.tsx # Product submission form
│
├── lib/                           # Utilities and helpers
│   ├── blockchain/
│   │   ├── contract.ts            # Blockchain contract interaction
│   │   ├── hash.ts                # Cryptographic hashing
│   │   └── ProductAuthentication.abi.json  # Contract ABI
│   ├── database/
│   │   ├── connection.ts          # Database connection utilities
│   │   ├── models.ts              # Database models and schemas
│   │   └── models-mongoose.ts     # Mongoose models (MongoDB)
│   ├── storage/
│   │   └── upload.ts              # File upload utilities (S3/Cloudinary)
│   └── utils/
│       └── helpers.ts             # Utility functions
│
├── contracts/                     # Solidity smart contracts
│   └── ProductAuthentication.sol  # Main smart contract
│
├── scripts/                       # Scripts
│   └── deploy.ts                  # Deploy smart contract
│
├── types/                         # TypeScript types
│   └── index.ts                   # Type definitions
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore file
├── hardhat.config.ts              # Hardhat configuration
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # Project documentation
├── SETUP.md                       # Setup guide
└── PROJECT_STRUCTURE.md           # This file
```

## Key Files Explained

### API Routes (`app/api/`)
- **products/submit**: Handles product submission with file uploads
- **products**: Retrieves user's products
- **verification/pending**: Gets products pending verification
- **verification/verify**: Authenticator verification endpoint
- **certificates/create**: Creates digital certificate
- **blockchain/store**: Stores hash on blockchain
- **verify**: Public verification endpoint

### Components (`components/`)
- **ProductSubmissionForm**: Form for submitting products

### Blockchain (`lib/blockchain/`)
- **contract.ts**: Ethers.js contract interaction
- **hash.ts**: SHA-256 hashing utilities
- **ProductAuthentication.abi.json**: Contract ABI

### Database (`lib/database/`)
- **connection.ts**: Database connection (PostgreSQL/MongoDB)
- **models.ts**: Database schemas and types
- **models-mongoose.ts**: Mongoose models for MongoDB

### Storage (`lib/storage/`)
- **upload.ts**: File upload to AWS S3 or Cloudinary

### Smart Contract (`contracts/`)
- **ProductAuthentication.sol**: Solidity contract for storing hashes

## Data Flow

1. **User Submission** → API stores in database + file storage
2. **Authenticator Review** → Updates product status
3. **Certificate Creation** → Generates JSON + hash
4. **Blockchain Storage** → Stores hash on-chain
5. **Public Verification** → Queries blockchain + verifies hash
