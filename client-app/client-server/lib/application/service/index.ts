import ICloudCommunicator from '../../components/communicators/ICloudCommunicator'
import IClientDA from '../dataAccess/IClientDA'
import IAppState from '../../components/communicators/AppState/IAppState'
const HashUtil = require('./Util/HashUtil')
const ComputationDelegationUtil = require('./Util/ComputationDelegation.js/ComputationDelegationUtil')
const ResultsRetrievalUtil = require('./Util/ResultsRetrieval/ResultsRetrievalUtil')
const InitClientUtil = require('./Util/InitClient/InitClientUtil')

class ClientService {
    clientDA
    cloudInstance : ICloudCommunicator; // Remote to communicate with the communicators
    appState: IAppState
    constructor (cloudInstance: ICloudCommunicator, clientDA: IClientDA, appState: IAppState) {
      this.clientDA = clientDA
      this.cloudInstance = cloudInstance
      this.appState = appState
    }

    async initClient ({ masterKey, attributes, clientID, clientIP }: { masterKey: number, attributes: any, clientID: string, clientIP: string }) {
      const { NUMBER_OF_BINS, MAXIMUM_LOAD, SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, vectorX } = await this.cloudInstance.getCloudConfig()
      const hashedAttributes = HashUtil.attributesToHash(attributes)

      // Save masterkey and attributes to DB
      this.clientDA.saveClientID(clientID)
      this.clientDA.saveMasterKey(masterKey)
      this.clientDA.saveAttributes(attributes)

      const { blindingFactors, blindedValuesMatrix } = InitClientUtil.getBlindingFactorsAndBlindedValues(hashedAttributes, NUMBER_OF_BINS, MAXIMUM_LOAD, SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, vectorX, masterKey)

      this.clientDA.saveBlindingFactors(blindingFactors) // Save blinding factors so that we do not have to recompute during results retrieval
      this.clientDA.saveBlindedValuesMatrix(blindedValuesMatrix)// Save the blinded values so that we dont have to recompuate during results computation

      this.cloudInstance.saveClientAttributes({ clientID, blindedValuesMatrix }) // Save blinded values to communicators
      this.cloudInstance.saveClientIP({ clientID, clientIP }) // To simulate the ID to IP retrieval
    }

    // Requestee
    async computationDelegation ({ requesterID } : { requesterID: string}) {
      const TEMP_KEY = 321n
      const masterKey = this.clientDA.getMasterKey()
      const blindedValuesMatrix = this.clientDA.getBlindedValuesMatrix()
      const { SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, NUMBER_OF_BINS, MAXIMUM_LOAD, vectorX } = await this.cloudInstance.getCloudConfig()

      const qPrimeMatrix = ComputationDelegationUtil.generateQPrimeMatrix(SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, NUMBER_OF_BINS, MAXIMUM_LOAD, TEMP_KEY, vectorX, masterKey, blindedValuesMatrix)

      this.cloudInstance.resultsComputation({ requesterID, qPrimeMatrix })
    }

    // Requester
    async initPSI ({ requesteeID } : {requesteeID : string}) {
      const requesterID = this.clientDA.getClientID()
      const requesteeInstance = await this.cloudInstance.getClientIP({ clientID: requesteeID })
      this.appState.initPsi()
      await requesteeInstance.computationDelegation({ requesterID })
    }

    async resultsRetrieval ({ qPrimeMatrix, qPrimePrimeMatrix } : {qPrimeMatrix :bigint[][], qPrimePrimeMatrix: bigint[][]}) {
      const { NUMBER_OF_BINS, LARGE_PRIME_NUMBER, SMALL_PRIME_NUMBER, MAXIMUM_LOAD, vectorX } = await this.cloudInstance.getCloudConfig()
      const attributes = this.clientDA.getAttributes()
      const hashedAttributes = HashUtil.attributesToHash(attributes)
      const blindingFactors = this.clientDA.getBlindingFactors() // Stored in initClient
      const realAnswerArray = ResultsRetrievalUtil.resultsRetrieval(SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, MAXIMUM_LOAD, NUMBER_OF_BINS, vectorX, blindingFactors, hashedAttributes, qPrimeMatrix, qPrimePrimeMatrix)
      const finalResult = HashUtil.hashToNameAndNumber(attributes, realAnswerArray)
      this.appState.completePsi(finalResult)
    }

    getIntersectionResult () : {name: string, number: number}[] | 'isPending' | void {
      return this.appState.getIntersectionResult()
    }

    getAttributes () : {name: string, number: number}[] | void {
      return this.clientDA.getAttributes()
    }
}

export default ClientService
