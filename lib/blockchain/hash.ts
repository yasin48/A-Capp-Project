// Cryptographic hashing utilities
import { createHash } from 'crypto';

/**
 * Generate SHA-256 hash of JSON data
 * @param jsonData JSON string or object
 * @returns Hex string of the hash
 */
export function generateHash(jsonData: string | object): string {
  const dataString = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);
  const hash = createHash('sha256');
  hash.update(dataString);
  return hash.digest('hex');
}

/**
 * Verify hash matches the data
 * @param data JSON string or object
 * @param hash Hex string of the hash to verify
 * @returns Boolean indicating if hash matches
 */
export function verifyHash(data: string | object, hash: string): boolean {
  const computedHash = generateHash(data);
  return computedHash === hash;
}
