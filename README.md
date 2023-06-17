# VeriHash

VeriHash is a powerful solution designed to provide secure storage and distribution of sensitive data using advanced cryptographic techniques. It combines the SHA256 hashing algorithm, optional encryption, and Shamir's Secret Sharing (SSS) algorithm, and leverages the MetaNet Client for key derivation. With VeriHash, you can ensure the confidentiality, integrity, and availability of your valuable information.

## Description

VeriHash leverages the robust SHA256 hashing algorithm, widely recognized for its strength and resistance to cryptographic attacks. With VeriHash, you have the option to encrypt your data prior to hashing, adding an extra layer of security. This encryption step can be performed using standard encryption algorithms such as AES256-GCM.

Once the data is hashed (and optionally encrypted), VeriHash employs Shamir's Secret Sharing algorithm. This algorithm splits the hashed data into multiple slices, creating a threshold scheme where a specified number of slices are required to reconstruct the original data. Each slice contains no identifiable information about the original data, ensuring that even if a subset of slices is compromised, the complete data remains secure.

To enhance the security and decentralization further, VeriHash generates separate Bitcoin transactions for each slice using the MetaNet Client. Each transaction contains a unique Unspent Transaction Output (UTXO) that holds an individual slice of the hashed data. By distributing the slices across multiple Bitcoin transactions, VeriHash avoids consolidating the data in a single location, providing additional protection against attacks.

## Key Features

- Secure Hashing: Utilizes the SHA256 hashing algorithm to generate a unique and irreversible representation of the data.
- Optional Encryption: Supports optional encryption using industry-standard algorithms like AES or RSA before hashing for an added layer of confidentiality.
- Shamir's Secret Sharing: Divides the hashed (and optionally encrypted) data into multiple slices using Shamir's Secret Sharing algorithm, ensuring no individual slice reveals any information about the original data.
- Bitcoin Transaction Splitting: Creates separate Bitcoin transactions, each containing a distinct UTXO holding a slice of the hashed data, distributing the data across multiple locations in the blockchain.
- MetaNet Client Integration: Leverages the MetaNet Client for key derivation during the creation of Bitcoin transactions, providing enhanced security and user-owned identity management.

VeriHash offers a comprehensive and resilient approach to securely store and distribute sensitive data. By combining the strength of the SHA256 hashing algorithm, the flexibility of encryption, the robustness of Shamir's Secret Sharing, and the decentralization of Bitcoin transactions, VeriHash establishes a strong foundation for protecting valuable information.

Note: It's important to keep track of the necessary number of slices and the associated Bitcoin UTXOs to successfully reconstruct the original data when needed. This can be done using an overlay network, or some other local tracking system.

## Security Considerations

While VeriHash provides advanced security measures, it's essential to stay informed about potential vulnerabilities or developments in the underlying algorithms. Regularly updating and reviewing the security practices within VeriHash is recommended to maintain the highest level of protection for your sensitive data.

## Credits
Makes use of [SecretCoin](https://github.com/mohrt/secretcoin)'s implementation of Shamir's Secret Sharing algorithm.

## License

The license for the code in this repository is the Open BSV License