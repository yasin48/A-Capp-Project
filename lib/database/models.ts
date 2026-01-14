// Database models and schema definitions
// Supports both PostgreSQL (using Prisma-style schema) and MongoDB

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'authenticator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  serialNumber: string;
  brand: string;
  productName: string;
  description?: string;
  images: string[]; // URLs to stored images
  status: 'pending' | 'under_review' | 'authentic' | 'not_authentic' | 'certified';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Authenticator ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  productId: string;
  authenticatorId: string;
  decision: 'authentic' | 'not_authentic';
  notes?: string;
  crossCheckResults?: Record<string, any>;
  verifiedAt: Date;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  productId: string;
  verificationId: string;
  productData: {
    productId: string;
    serialNumber: string;
    brand: string;
    productName: string;
  };
  authenticationDecision: 'authentic' | 'not_authentic';
  timestamp: string;
  reason?: string;
  notes?: string;
  jsonData: string; // JSON string of the certificate
  hash: string; // SHA-256 hash of JSON data
  blockchainTxHash?: string; // Transaction hash from blockchain
  blockchainBlockNumber?: number;
  createdAt: Date;
}

export interface BlockchainRecord {
  id: string;
  certificateId: string;
  productId: string;
  hash: string;
  txHash: string;
  blockNumber: number;
  network: string;
  contractAddress: string;
  createdAt: Date;
}

// MongoDB Schema (if using Mongoose)
export const UserSchema = {
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'authenticator', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

export const ProductSchema = {
  userId: { type: String, required: true },
  serialNumber: { type: String, required: true },
  brand: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'authentic', 'not_authentic', 'certified'],
    default: 'pending',
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

export const VerificationSchema = {
  productId: { type: String, required: true },
  authenticatorId: { type: String, required: true },
  decision: { type: String, enum: ['authentic', 'not_authentic'], required: true },
  notes: { type: String },
  crossCheckResults: { type: Object },
  verifiedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
};

export const CertificateSchema = {
  productId: { type: String, required: true },
  verificationId: { type: String, required: true },
  productData: { type: Object, required: true },
  authenticationDecision: { type: String, enum: ['authentic', 'not_authentic'], required: true },
  timestamp: { type: String, required: true },
  reason: { type: String },
  notes: { type: String },
  jsonData: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  blockchainTxHash: { type: String },
  blockchainBlockNumber: { type: Number },
  createdAt: { type: Date, default: Date.now },
};

export const BlockchainRecordSchema = {
  certificateId: { type: String, required: true },
  productId: { type: String, required: true },
  hash: { type: String, required: true },
  txHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number, required: true },
  network: { type: String, required: true },
  contractAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
};

// PostgreSQL SQL Schema (alternative)
export const sqlSchema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'authenticator', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  serial_number VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT[], -- Array of image URLs
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'authentic', 'not_authentic', 'certified')),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  authenticator_id UUID NOT NULL REFERENCES users(id),
  decision VARCHAR(20) NOT NULL CHECK (decision IN ('authentic', 'not_authentic')),
  notes TEXT,
  cross_check_results JSONB,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  verification_id UUID NOT NULL REFERENCES verifications(id),
  product_data JSONB NOT NULL,
  authentication_decision VARCHAR(20) NOT NULL CHECK (authentication_decision IN ('authentic', 'not_authentic')),
  timestamp VARCHAR(255) NOT NULL,
  reason TEXT,
  notes TEXT,
  json_data TEXT NOT NULL,
  hash VARCHAR(64) UNIQUE NOT NULL,
  blockchain_tx_hash VARCHAR(66),
  blockchain_block_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain records table
CREATE TABLE IF NOT EXISTS blockchain_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id),
  product_id UUID NOT NULL REFERENCES products(id),
  hash VARCHAR(64) NOT NULL,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  block_number INTEGER NOT NULL,
  network VARCHAR(50) NOT NULL,
  contract_address VARCHAR(42) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_serial_number ON products(serial_number);
CREATE INDEX IF NOT EXISTS idx_verifications_product_id ON verifications(product_id);
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON certificates(hash);
CREATE INDEX IF NOT EXISTS idx_certificates_product_id ON certificates(product_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_hash ON blockchain_records(hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_tx_hash ON blockchain_records(tx_hash);
`;
