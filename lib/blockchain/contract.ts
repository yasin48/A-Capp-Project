// Blockchain contract interaction utilities
import { ethers } from 'ethers';
import ProductAuthenticationABI from './ProductAuthentication.abi.json';

export interface ContractConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey: string;
}

export class ProductAuthContract {
  private provider: ethers.Provider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(config: ContractConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.signer = new ethers.Wallet(config.privateKey, this.provider);
    this.contract = new ethers.Contract(
      config.contractAddress,
      ProductAuthenticationABI,
      this.signer
    );
  }

  /**
   * Store a hash on the blockchain
   * @param hash The SHA-256 hash (as hex string)
   * @param productId The product ID
   * @returns Transaction receipt
   */
  async storeHash(hash: string, productId: string) {
    try {
      // Convert hex string to bytes32
      const hashBytes32 = hash.length === 64 
        ? '0x' + hash 
        : ethers.keccak256(ethers.toUtf8Bytes(hash));
      const tx = await this.contract.storeHash(hashBytes32, productId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error: any) {
      console.error('Error storing hash on blockchain:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Verify if a hash exists on the blockchain
   * @param hash The hash to verify
   * @returns Verification result
   */
  async verifyHash(hash: string) {
    try {
      // Convert hex string to bytes32
      const hashBytes32 = hash.length === 64 
        ? '0x' + hash 
        : ethers.keccak256(ethers.toUtf8Bytes(hash));
      const result = await this.contract.verifyHash(hashBytes32);
      
      return {
        exists: result.exists,
        productId: result.productId,
        timestamp: result.timestamp.toString(),
      };
    } catch (error: any) {
      console.error('Error verifying hash:', error);
      return {
        exists: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Get hash by product ID
   * @param productId The product ID
   * @returns Hash and existence status
   */
  async getHashByProductId(productId: string) {
    try {
      const result = await this.contract.getHashByProductId(productId);
      return {
        hash: result.hash,
        exists: result.exists,
      };
    } catch (error: any) {
      console.error('Error getting hash by product ID:', error);
      return {
        hash: null,
        exists: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Get record details by hash
   * @param hash The hash
   * @returns Record details
   */
  async getRecord(hash: string) {
    try {
      // Convert hex string to bytes32
      const hashBytes32 = hash.length === 64 
        ? '0x' + hash 
        : ethers.keccak256(ethers.toUtf8Bytes(hash));
      const result = await this.contract.getRecord(hashBytes32);
      
      return {
        productId: result.productId,
        timestamp: result.timestamp.toString(),
        recordedBy: result.recordedBy,
        exists: result.exists,
      };
    } catch (error: any) {
      console.error('Error getting record:', error);
      return {
        exists: false,
        error: error.message || 'Unknown error',
      };
    }
  }
}

// Singleton instance
let contractInstance: ProductAuthContract | null = null;

export function getContractInstance(): ProductAuthContract {
  if (!contractInstance) {
    const config: ContractConfig = {
      rpcUrl: process.env.RPC_URL || '',
      contractAddress: process.env.CONTRACT_ADDRESS || '',
      privateKey: process.env.PRIVATE_KEY || '',
    };

    if (!config.rpcUrl || !config.contractAddress || !config.privateKey) {
      throw new Error('Blockchain configuration missing. Check RPC_URL, CONTRACT_ADDRESS, and PRIVATE_KEY in .env');
    }

    contractInstance = new ProductAuthContract(config);
  }

  return contractInstance;
}
