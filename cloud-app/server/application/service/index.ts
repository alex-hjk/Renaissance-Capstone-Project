import ResultsComputationUtil from './Util/ResultsComputation/ResultsComputationUtil'
const GaloisUtil = require('./Util/GaloisUtil')

class CloudService {
    cloudDA;

    constructor (cloudDA: any) {
      this.cloudDA = cloudDA
    }

    getCloudConfig = () => {
      return this.cloudDA.getCloudConfig()
    }

    getClientIP = (clientID: string) => {
      // TODO: Check should be done at the DA layer
      if (!this.cloudDA.getClientIP(clientID)) {
        throw new Error('This client cannot be found')
      }
      return this.cloudDA.getClientIP(clientID)
    }

    saveClientAttributes (clientID: string, attributes: bigint[][]) {
      this.cloudDA.saveClientAttributes(clientID, attributes)
    }

    saveClientIP (clientID: string, clientIP: string) {
      this.cloudDA.saveClientIP(clientID, clientIP)
    }

    resultsComputation (request: {requesterID: string, qPrimeMatrix: bigint[][]}) {
      const TEMP_KEY = 987n
      const { requesterID, qPrimeMatrix } = request
      const requesterInstance = this.cloudDA.getClientIP(requesterID)
      const requesterBlindedValuesMatrix = this.cloudDA.getBlindedValuesMatrix(requesterID) // TODO: Should return a bigint[][]
      const { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER, vectorX } = this.getCloudConfig()
      const [field] = GaloisUtil.generateGaloisFields([LARGE_PRIME_NUMBER])
      const qPrimePrimeMatrix = ResultsComputationUtil.generateQPrimePrimeMatrix(requesterBlindedValuesMatrix, field, NUMBER_OF_BINS, MAXIMUM_LOAD, TEMP_KEY, vectorX)

      requesterInstance.resultsRetrieval({ qPrimeMatrix, qPrimePrimeMatrix })
    }

    getRegisteredClients () : string[] {
      return this.cloudDA.getRegisteredClients()
    }

    updateNumBins (numBins : number) : void {
      this.cloudDA.updateNumBins(numBins)
    }
}

export default CloudService
