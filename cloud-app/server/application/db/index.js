class CloudMemDB {
    clientIDtoIPMap; // // KV store of [clientID] : client instance
    blindedValuesMatrixMap; // Key Value store for blindedValuesMatrix [clientID: blindedValuesMatrix]
    constructor () {
      this.blindedValuesMatrixMap = {}
      this.clientIDtoIPMap = {}
    }

    saveClientAttributes (clientID, blindedValuesMatrix) {
      this.blindedValuesMatrixMap[clientID] = blindedValuesMatrix
    }

    saveClientIP (clientID, clientIP) {
      this.clientIDtoIPMap[clientID] = clientIP
    }
}

module.exports = CloudMemDB
