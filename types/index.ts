// TypeScript type definitions

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductSubmission {
  serialNumber: string;
  brand: string;
  productName: string;
  description?: string;
  images: File[];
}

export interface VerificationDecision {
  decision: 'authentic' | 'not_authentic';
  notes?: string;
  crossCheckResults?: Record<string, any>;
}

export interface CertificateData {
  productId: string;
  authenticationDecision: 'authentic' | 'not_authentic';
  timestamp: string;
  reason?: string;
  notes?: string;
  productData: {
    productId: string;
    serialNumber: string;
    brand: string;
    productName: string;
  };
}

export interface BlockchainVerificationResult {
  verified: boolean;
  exists: boolean;
  productId?: string;
  timestamp?: string;
  txHash?: string;
  blockNumber?: number;
  error?: string;
}
