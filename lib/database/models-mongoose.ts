// Mongoose models (if using MongoDB)
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'authenticator', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
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
});

const VerificationSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  authenticatorId: { type: String, required: true },
  decision: { type: String, enum: ['authentic', 'not_authentic'], required: true },
  notes: { type: String },
  crossCheckResults: { type: mongoose.Schema.Types.Mixed },
  verifiedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const CertificateSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  verificationId: { type: String, required: true },
  productData: { type: mongoose.Schema.Types.Mixed, required: true },
  authenticationDecision: { type: String, enum: ['authentic', 'not_authentic'], required: true },
  timestamp: { type: String, required: true },
  reason: { type: String },
  notes: { type: String },
  jsonData: { type: String, required: true },
  hash: { type: String, required: true, unique: true },
  blockchainTxHash: { type: String },
  blockchainBlockNumber: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const BlockchainRecordSchema = new mongoose.Schema({
  certificateId: { type: String, required: true },
  productId: { type: String, required: true },
  hash: { type: String, required: true },
  txHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number, required: true },
  network: { type: String, required: true },
  contractAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Verification = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export const BlockchainRecord = mongoose.models.BlockchainRecord || mongoose.model('BlockchainRecord', BlockchainRecordSchema);
