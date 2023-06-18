const secrets = require('./secrets')
const { get, set, remove } = require('babbage-kvstore')
const bsv = require('babbage-bsv')

// Create hashed data that is referenced securely on chain
const create = async (secret = 'secret', numberOfSlices = 2, threshold = 2) => {
  // Data to hash and store on chain
  const hashedData = bsv.crypto.Hash.sha256(Buffer.from(secret)).toString('base64')
  const slicedData = secrets.share(secrets.str2hex(hashedData), numberOfSlices, threshold)

  // Use the kvstore overlay to create a separate transaction for each slice
  // This also generates a separate protectedKey for the slice retrieval based on the randomUUID
  let sliceKeys = []
  for (const slice of slicedData) {
    const sliceKey = crypto.randomUUID()
    await set(sliceKey, slice)
    sliceKeys.push(sliceKey)
  }
  return sliceKeys
}

// Verify the slices from each UTXO combine to equal the hashed data
const validate = async (dataToValidate, sliceKeys = []) => {
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

// Remove the slice keys from kvstore overlay
const destroy = async (sliceKeys = []) => {
  for (const key of sliceKeys) {
    await remove(key)
  }
}

module.exports = { create, validate, destroy }
