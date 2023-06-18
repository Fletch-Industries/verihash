/* eslint-disable @typescript-eslint/no-empty-function */
import secrets from './secrets'
import { get, set, remove } from 'babbage-kvstore'
import bsv from 'babbage-bsv'

export class VeriHash {
  constructor() {}
  /**
   * Create hashed data that is referenced securely on chain
   * @public
   * @param {string} secret - data to hash and store securely on chain
   * @param {number} numberOfSlices - number of slices to split the hash into
   * @param {number} threshold - number of required slices to validate data integrity
   * @returns 
   */
  async create(secret = 'secret', numberOfSlices = 2, threshold = 2): Promise<string[]> {
    // Data to hash and store on chain
    const hashedData = bsv.crypto.Hash.sha256(Buffer.from(secret)).toString('base64')
    const slicedData = secrets.share(secrets.str2hex(hashedData), numberOfSlices, threshold)

    // Use the kvstore overlay to create a separate transaction for each slice
    // This also generates a separate protectedKey for the slice retrieval based on the randomUUID
    const sliceKeys: string[] = [];
    for (const slice of slicedData) {
    const sliceKey = crypto.randomUUID()
    await set(sliceKey, slice)
        sliceKeys.push(sliceKey)
    }
    return sliceKeys
  }

  /**
   * Verify the slices from each UTXO combine to equal the hashed data
   * @public
   * @param {string} dataToValidate - data to validate
   * @param {Array<string>} sliceKeys - slice keys used for looking up hash slices
   * @returns 
   */
  async validate(dataToValidate: string, sliceKeys: string[] = []): Promise<boolean> {
    // Get slices from slice keys
    let slices = await Promise.all(sliceKeys.map(key => get(key)));
    slices = slices.filter(slice => slice !== undefined);

    // Make sure data was found
    if (slices.length === 0) {
      return false
    }

    const hashedData = bsv.crypto.Hash.sha256(Buffer.from(dataToValidate)).toString('base64')
    const combinedSecrets = secrets.hex2str(secrets.combine(slices))

    if (hashedData === combinedSecrets) {
      return true
    }
    return false
  }

  /**
   * Remove the slice keys from kvstore overlay
   * @public
   * @param {Array<string>} sliceKeys - slice keys used for looking up hash slices
   */
  async destroy(sliceKeys:string[] = []): Promise<void> {
    for (const key of sliceKeys) {
        await remove(key)
    }
  }
}