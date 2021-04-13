// The role of this class is to check the validity of the inputs

class ClientController {
    clientServiceInstance;

    constructor (clientServiceInstance: any) {
      this.clientServiceInstance = clientServiceInstance
    }

    initClient (request: { masterKey: number, attributes: {'name': string, 'number': number}[], clientID: string, clientIP: string }) {
      const { masterKey, attributes, clientID, clientIP } = request
      if (!masterKey) {
        throw new Error('Master Key is not defined')
      }
      if (!attributes || !attributes.length) {
        throw new Error('Attributes must be an array and non 0')
      }
      if (!clientID) {
        throw new Error('Client ID is not defined')
      }
      return new Promise((resolve, reject) => {
        resolve(this.clientServiceInstance.initClient({ masterKey, attributes, clientID, clientIP })
        )
      })
    }

    initPSI (request: {requesteeID: string}) {
      const { requesteeID } = request
      return new Promise((resolve, reject) => {
        resolve(this.clientServiceInstance.initPSI({ requesteeID }))
      })
    }

    computationDelegation (request: {requesterID: string}) {
      const { requesterID } = request
      return new Promise((resolve, reject) => {
        resolve(this.clientServiceInstance.computationDelegation({ requesterID }))
      })
    }

    resultsRetrieval (request: {qPrimeMatrix: bigint[][], qPrimePrimeMatrix: bigint[][]}) {
      const { qPrimeMatrix, qPrimePrimeMatrix } = request
      return new Promise((resolve, reject) => {
        resolve(this.clientServiceInstance.resultsRetrieval({ qPrimeMatrix, qPrimePrimeMatrix }))
      })
    }

    getIntersectionResult () {
      return this.clientServiceInstance.getIntersectionResult()
    }

    getAttributes () {
      return this.clientServiceInstance.getAttributes()
    }
}

export default ClientController
