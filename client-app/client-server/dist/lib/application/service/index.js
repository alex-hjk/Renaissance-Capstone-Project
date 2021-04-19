"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashUtil = require('./Util/HashUtil');
const ComputationDelegationUtil = require('./Util/ComputationDelegation.js/ComputationDelegationUtil');
const ResultsRetrievalUtil = require('./Util/ResultsRetrieval/ResultsRetrievalUtil');
const InitClientUtil = require('./Util/InitClient/InitClientUtil');
class ClientService {
    constructor(cloudInstance, clientDA, appState) {
        this.clientDA = clientDA;
        this.cloudInstance = cloudInstance;
        this.appState = appState;
    }
    async initClient({ masterKey, attributes, clientID, clientIP }) {
        const { NUMBER_OF_BINS, MAXIMUM_LOAD, SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, vectorX } = await this.cloudInstance.getCloudConfig();
        const hashedAttributes = HashUtil.attributesToHash(attributes);
        this.clientDA.saveClientID(clientID);
        this.clientDA.saveMasterKey(masterKey);
        this.clientDA.saveAttributes(attributes);
        const { blindingFactors, blindedValuesMatrix } = InitClientUtil.getBlindingFactorsAndBlindedValues(hashedAttributes, NUMBER_OF_BINS, MAXIMUM_LOAD, SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, vectorX, masterKey);
        this.clientDA.saveBlindingFactors(blindingFactors);
        this.clientDA.saveBlindedValuesMatrix(blindedValuesMatrix);
        this.cloudInstance.saveClientAttributes({ clientID, blindedValuesMatrix });
        this.cloudInstance.saveClientIP({ clientID, clientIP });
        return blindedValuesMatrix.values;
    }
    async computationDelegation({ requesterID }) {
        const TEMP_KEY = 321n;
        const masterKey = this.clientDA.getMasterKey();
        const blindedValuesMatrix = this.clientDA.getBlindedValuesMatrix();
        const { SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, NUMBER_OF_BINS, MAXIMUM_LOAD, vectorX } = await this.cloudInstance.getCloudConfig();
        const qPrimeMatrix = ComputationDelegationUtil.generateQPrimeMatrix(SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, NUMBER_OF_BINS, MAXIMUM_LOAD, TEMP_KEY, vectorX, masterKey, blindedValuesMatrix);
        this.cloudInstance.resultsComputation({ requesterID, qPrimeMatrix });
    }
    async initPSI({ requesteeID }) {
        const requesterID = this.clientDA.getClientID();
        const requesteeInstance = await this.cloudInstance.getClientIP({ clientID: requesteeID });
        this.appState.initPsi();
        await requesteeInstance.computationDelegation({ requesterID });
    }
    async resultsRetrieval({ qPrimeMatrix, qPrimePrimeMatrix }) {
        const { NUMBER_OF_BINS, LARGE_PRIME_NUMBER, SMALL_PRIME_NUMBER, MAXIMUM_LOAD, vectorX } = await this.cloudInstance.getCloudConfig();
        const attributes = this.clientDA.getAttributes();
        const hashedAttributes = HashUtil.attributesToHash(attributes);
        const blindingFactors = this.clientDA.getBlindingFactors();
        const realAnswerArray = ResultsRetrievalUtil.resultsRetrieval(SMALL_PRIME_NUMBER, LARGE_PRIME_NUMBER, MAXIMUM_LOAD, NUMBER_OF_BINS, vectorX, blindingFactors, hashedAttributes, qPrimeMatrix, qPrimePrimeMatrix);
        const finalResult = HashUtil.hashToNameAndNumber(attributes, realAnswerArray);
        this.appState.completePsi(finalResult, { qPrimeMatrix, qPrimePrimeMatrix });
    }
    getIntersectionResult() {
        return this.appState.getIntersectionResult();
    }
    getAttributes() {
        return this.clientDA.getAttributes();
    }
}
exports.default = ClientService;
