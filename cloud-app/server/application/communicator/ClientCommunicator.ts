// A pseudo client instance for the communicators to communicate with the client
import MarshallerUtil from '../../lib/components/controller/Util/MarshallerUtil'

const fetch = require('node-fetch')
class ClientCommunicator {
    clientIP
    constructor (clientIP: string) {
      this.clientIP = clientIP
    }

    // TODO: change this to accept a bigint[][] instead
    async resultsRetrieval (request: {qPrimeMatrix: any, qPrimePrimeMatrix: any}) {
      const { qPrimeMatrix, qPrimePrimeMatrix } = request
      const requestObject = { qPrimeMatrix: MarshallerUtil.marshallGaloisMatrixToBigIntArr(qPrimeMatrix), qPrimePrimeMatrix: MarshallerUtil.marshallGaloisMatrixToBigIntArr(qPrimePrimeMatrix) }
      await fetch(`${this.clientIP}/resultsRetrieval`, { method: 'POST', body: JSON.stringify(requestObject), headers: { 'Content-Type': 'application/json' } })
    }
}

export default ClientCommunicator
