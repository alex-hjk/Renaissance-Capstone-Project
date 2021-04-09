import IClientDA from './IClientDA'

// Data access layer
class ClientMemDA implements IClientDA {
    clientDB
    // TODO: Change Any to a DB interface
    constructor (clientDB : any) {
      this.clientDB = clientDB
    }

    saveClientID (clientID: string) {
      this.clientDB.clientID = clientID
    }

    saveMasterKey (masterKey : number) {
      this.clientDB.masterKey = masterKey
    }

    saveAttributes (attributes : any) {
      this.clientDB.attributes = attributes
    }

    saveBlindedValuesMatrix (blindedValuesMatrix : any) {
      this.clientDB.blindedValuesMatrix = blindedValuesMatrix
    }

    saveBlindingFactors (blindingFactors : any) {
      this.clientDB.blindingFactors = blindingFactors
    }

    getClientID () {
      return this.clientDB.clientID
    }

    getMasterKey () {
      return this.clientDB.masterKey
    }

    getAttributes () {
      return this.clientDB.attributes
    }

    getBlindedValuesMatrix () {
      return this.clientDB.blindedValuesMatrix
    }

    getBlindingFactors () {
      return this.clientDB.blindingFactors
    }
}

export default ClientMemDA
