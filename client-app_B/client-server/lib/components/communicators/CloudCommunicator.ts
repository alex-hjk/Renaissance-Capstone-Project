import MarshallerUtil from './Util/MarshallerUtil'
import ClientCommunicator from './ClientCommunicator'

const fetch = require('node-fetch')
const cloudOrigin = 'http://localhost:5001' // IP Address of the Cloud
// export const cloudOrigin = 'http://eopsicloud-env-1.eba-bairbewe.ap-southeast-1.elasticbeanstalk.com' // Production endpoint
/**
 * This layer implements the methods that CloudController has
 * - marshalls/ unmarshalls data to be sent and received from the communicators
 * - Implements API frameworks
 */
class CloudCommunicator {
  cloudUrl: string;

  constructor () {
    this.cloudUrl = `${cloudOrigin}/api/psi`
  }

  async getCloudConfig () : Promise<{NUMBER_OF_BINS: number, MAXIMUM_LOAD: number, LARGE_PRIME_NUMBER: bigint, SMALL_PRIME_NUMBER: bigint, vectorX: bigint[] }> {
    const response = await fetch(`${this.cloudUrl}/getCloudConfig`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const { cloudConfig } = await response.json()
    const { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER, SMALL_PRIME_NUMBER, vectorX } = JSON.parse(cloudConfig)
    return { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER: BigInt(LARGE_PRIME_NUMBER), SMALL_PRIME_NUMBER: BigInt(SMALL_PRIME_NUMBER), vectorX: vectorX.map((x: string) => BigInt(x)) }
  }

  // Returns a client communicator instance
  async getClientIP ({ clientID }: {clientID: string}) {
    const response = await fetch(`${this.cloudUrl}/getClientIP`, {
      method: 'POST',
      body: JSON.stringify({ clientID }),
      headers: { 'Content-Type': 'application/json' }
    })
    const { clientIP }: {clientIP: string} = await response.json()
    const clientCommunicator = new ClientCommunicator(clientIP)
    return clientCommunicator
  }

  async saveClientAttributes ({ clientID, blindedValuesMatrix }: {clientID: string, blindedValuesMatrix: any}) {
    try {
      const marshalledBlindedValues = MarshallerUtil.marshallObject(blindedValuesMatrix)
      await fetch(`${this.cloudUrl}/saveClientAttributes`, { method: 'POST', body: JSON.stringify({ clientID, blindedValuesMatrix: marshalledBlindedValues }), headers: { 'Content-Type': 'application/json' } })
      console.log('Saved Client Attributes to the communicators')
    } catch (e) {
      throw new Error(`Error in saving client attributes:${e.message}`)
    }
  }

  async saveClientIP ({ clientID, clientIP }: {clientID: string, clientIP: string}) {
    try {
      await fetch(`${this.cloudUrl}/saveClientIP`, { method: 'POST', body: JSON.stringify({ clientID, clientIP }), headers: { 'Content-Type': 'application/json' } })
      console.log('Saved client IP to the communicators')
    } catch (e) {
      console.log(e.message, 'Error in Client Communicator, saveClientInstance')
    }
  }

  // TODO: FIX ANY
  async resultsComputation ({ requesterID, qPrimeMatrix }: {requesterID: string, qPrimeMatrix: any}) {
    const marshalledQPrimeMatrix = MarshallerUtil.marshallObject(qPrimeMatrix) // TODO: qPrimeMatrix is currently a JSmatrix, make it a bigint[][] instead
    await fetch(`${this.cloudUrl}/resultsComputation`, { method: 'POST', body: JSON.stringify({ requesterID, qPrimeMatrix: marshalledQPrimeMatrix }), headers: { 'Content-Type': 'application/json' } })
    console.log('save client attributes')
  }
}

export default CloudCommunicator
