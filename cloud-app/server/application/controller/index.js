class CloudController {
    cloudService;
    constructor (cloudService) {
      this.cloudService = cloudService
    }

    getCloudConfig () {
      return this.cloudService.getCloudConfig()
    }

    getClientIP (request) {
      const { clientID } = request
      return this.cloudService.getClientIP(clientID)
    }

    saveClientAttributes (request) {
      const { clientID, blindedValuesMatrix } = request
      this.cloudService.saveClientAttributes(clientID, blindedValuesMatrix)
    }

    saveClientIP (request) {
      const { clientID, clientIP } = request
      this.cloudService.saveClientIP(clientID, clientIP)
    }

    resultsComputation (request) {
      const { requesterID, qPrimeMatrix } = request
      this.cloudService.resultsComputation({ requesterID, qPrimeMatrix })
    }

    getRegisteredClients () {
      return this.cloudService.getRegisteredClients()
    }

    updateNumBins (request) {
      const { numBins } = request
      this.cloudService.updateNumBins(numBins)
    }
}

module.exports = CloudController
