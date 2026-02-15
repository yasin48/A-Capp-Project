// Blockchain service wrapper for storing and verifying product hashes
// Uses the existing ProductAuthContract for blockchain interactions

import { getContractInstance } from './contract'

/**
 * Store product hash on the blockchain
 * @param productId - The unique product identifier
 * @param productHash - The SHA-256 hash of the certificate data (hex string)
 * @returns Transaction result with hash and block number
 */
export async function storeOnBlockchain(
    productId: string,
    productHash: string
) {
    const contract = getContractInstance()
    return await contract.storeHash(productHash, productId)
}

/**
 * Verify product exists on blockchain by product ID
 * @param productId - The unique product identifier
 * @returns Hash and existence status from blockchain
 */
export async function verifyFromBlockchain(productId: string) {
    const contract = getContractInstance()
    return await contract.getHashByProductId(productId)
}

/**
 * Verify a specific hash exists on blockchain
 * @param hash - The SHA-256 hash to verify
 * @returns Verification result with existence, productId, and timestamp
 */
export async function verifyHashOnBlockchain(hash: string) {
    const contract = getContractInstance()
    return await contract.verifyHash(hash)
}

/**
 * Get full record details from blockchain
 * @param hash - The hash to look up
 * @returns Full record with productId, timestamp, recordedBy, and existence
 */
export async function getBlockchainRecord(hash: string) {
    const contract = getContractInstance()
    return await contract.getRecord(hash)
}
