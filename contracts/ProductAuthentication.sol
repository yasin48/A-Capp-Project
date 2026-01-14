// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProductAuthentication
 * @dev Smart contract for storing product authentication hashes on blockchain
 */
contract ProductAuthentication {
    // Struct to store authentication record
    struct AuthRecord {
        bytes32 hash;
        string productId;
        uint256 timestamp;
        address recordedBy;
        bool exists;
    }

    // Mapping from hash to AuthRecord
    mapping(bytes32 => AuthRecord) public records;
    
    // Mapping from productId to hash
    mapping(string => bytes32) public productToHash;
    
    // Array to store all hashes for enumeration
    bytes32[] public allHashes;
    
    // Events
    event RecordStored(
        bytes32 indexed hash,
        string indexed productId,
        uint256 timestamp,
        address indexed recordedBy
    );
    
    event RecordVerified(
        bytes32 indexed hash,
        string indexed productId,
        bool verified
    );

    /**
     * @dev Store a hash for a product
     * @param _hash The SHA-256 hash of the certificate JSON
     * @param _productId The unique product identifier
     */
    function storeHash(bytes32 _hash, string memory _productId) public {
        require(!records[_hash].exists, "Hash already exists");
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        
        records[_hash] = AuthRecord({
            hash: _hash,
            productId: _productId,
            timestamp: block.timestamp,
            recordedBy: msg.sender,
            exists: true
        });
        
        productToHash[_productId] = _hash;
        allHashes.push(_hash);
        
        emit RecordStored(_hash, _productId, block.timestamp, msg.sender);
    }

    /**
     * @dev Verify if a hash exists on the blockchain
     * @param _hash The hash to verify
     * @return exists Whether the hash exists
     * @return productId The associated product ID
     * @return timestamp When it was recorded
     */
    function verifyHash(bytes32 _hash) 
        public 
        view 
        returns (
            bool exists,
            string memory productId,
            uint256 timestamp
        ) 
    {
        AuthRecord memory record = records[_hash];
        return (record.exists, record.productId, record.timestamp);
    }

    /**
     * @dev Get hash by product ID
     * @param _productId The product ID to look up
     * @return hash The associated hash
     * @return exists Whether the product ID exists
     */
    function getHashByProductId(string memory _productId) 
        public 
        view 
        returns (bytes32 hash, bool exists) 
    {
        hash = productToHash[_productId];
        exists = (hash != bytes32(0) && records[hash].exists);
        return (hash, exists);
    }

    /**
     * @dev Get total number of records
     * @return count Total number of stored records
     */
    function getTotalRecords() public view returns (uint256 count) {
        return allHashes.length;
    }

    /**
     * @dev Get record details by hash
     * @param _hash The hash to look up
     * @return productId The product ID
     * @return timestamp When it was recorded
     * @return recordedBy Address that recorded it
     * @return exists Whether the record exists
     */
    function getRecord(bytes32 _hash)
        public
        view
        returns (
            string memory productId,
            uint256 timestamp,
            address recordedBy,
            bool exists
        )
    {
        AuthRecord memory record = records[_hash];
        return (record.productId, record.timestamp, record.recordedBy, record.exists);
    }
}
