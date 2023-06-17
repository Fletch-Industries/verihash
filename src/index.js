const { createAction } = require('@babbage/sdk')
const pushdrop = require('pushdrop')
const secrets = require('./secrets')
// const bsv = require('babbage-bsv')

const createActions = async ({
  secret = 'super secret data here'
}) => {
  // Data to hash and store on chain
  const hashedData = crypto.createHash('sha256').update(secret).digest('base64')
  const slicedData = secrets.share(secrets.str2hex(hashedData), 2, 2)

  const data = {}

  for (const slice of slicedData) {
    // Create an action script based on the tsp-protocol
    const bitcoinOutputScript = await pushdrop.create({
      fields: [
        Buffer.from(slice, 'hex')
      ],
      protocolID: [2, 'verihash'],
      keyID: '1' // TODO: Consider using a random keyID each time
    })

    const tx = await createAction(({
      outputs: [{
        satoshis: 1,
        script: bitcoinOutputScript,
        description: 'Hashed secret data slice'
      }],
      description: 'Secret data hashed'
    }))
    data[tx.txid] = slice
  }
  return data
}

// Verify the slices from each UTXO combine to equal the hashed data
const isValidData = async ({
  dataToValidate,
  slices = []
}) => {
  const hashedData = crypto.createHash('sha256').update(dataToValidate).digest('base64')
  const combinedSecrets = secrets.hex2str(secrets.combine(slices))

  if (hashedData === combinedSecrets) {
    return true
  }
  return false
}

module.exports = { createActions, isValidData }
