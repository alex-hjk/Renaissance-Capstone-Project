import ClientCommunicator from './ClientCommunicator'

class CloudMemDA {
    cloudDB;

    constructor (cloudDB: any) {
      this.cloudDB = cloudDB
    }

    saveClientAttributes (clientID: string, blindedValuesMatrix: bigint[][]) {
      this.cloudDB.saveClientAttributes(clientID, blindedValuesMatrix)
    }

    saveClientIP (clientID: string, clientIP: string) {
      this.cloudDB.saveClientIP(clientID, clientIP)
    }

    getClientIP (clientID: string) {
      if (!clientID) {
        throw new Error('Client ID is undefined in data access layer')
      }
      const clientIP = this.cloudDB.clientIDtoIPMap[clientID]

      const clientCommunicatorInstance = new ClientCommunicator(clientIP)

      return clientCommunicatorInstance
    }

    getBlindedValuesMatrix (clientID: string) : bigint[][] {
      return this.cloudDB.blindedValuesMatrixMap[clientID]
    }
}

export default CloudMemDA
