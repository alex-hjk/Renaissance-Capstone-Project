const getDefaultCloudConfig = () => {
  const NUMBER_OF_BINS = 26
  const MAXIMUM_LOAD = 100
  const LARGE_PRIME_NUMBER = 1044444166666668888888889999999999n
  const SMALL_PRIME_NUMBER = 6435409832617n
  const vectorX = []
  for (let i = 1; i <= 2 * MAXIMUM_LOAD + 1; i++) {
    vectorX.push(BigInt(i))
  }
  return { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER, SMALL_PRIME_NUMBER, vectorX }
}

class CloudMemDB {
    cloudConfig;
    clientIDtoIPMap; // // KV store of [clientID] : client instance
    blindedValuesMatrixMap; // Key Value store for blindedValuesMatrix [clientID: blindedValuesMatrix]
    constructor () {
      this.blindedValuesMatrixMap = {}
      this.clientIDtoIPMap = {}
      this.cloudConfig = getDefaultCloudConfig()
    }

    saveClientAttributes (clientID, blindedValuesMatrix) {
      this.blindedValuesMatrixMap[clientID] = blindedValuesMatrix
    }

    saveClientIP (clientID, clientIP) {
      this.clientIDtoIPMap[clientID] = clientIP
    }

    getRegisteredClients () {
      return Object.keys(this.clientIDtoIPMap)
    }

    getCloudConfig () {
      return this.cloudConfig
    }

    updateNumBins (numBins) {
      this.cloudConfig.NUMBER_OF_BINS = numBins
      this.clientIDtoIPMap = {} // Update registered clients every time the number of bins is updated
      this.blindedValuesMatrixMap = {} // Update registered clients every time the number of bins is updated
    }
}

module.exports = CloudMemDB
