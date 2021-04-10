// Client 
class ClientController {
    
    clientServiceInstance;

    constructor(clientServiceInstance) {
        this.clientServiceInstance = clientServiceInstance
    }
    initClient(request){
        const {masterKey, attributes, clientID} = request
        this.clientServiceInstance.initClient({masterKey, attributes, clientID, clientIP: this })
    }

    initPSI(request){
        const {requesteeID} = request
        this.clientServiceInstance.initPSI({requesteeID})
    }

    computationDelegation(request){
        const {requesterID} = request
        this.clientServiceInstance.computationDelegation({requesterID})
    }

    resultsRetrieval(request){
        const { qPrimeMatrix, qPrimePrimeMatrix } = request;
        // Note a Galois matrix in sent in the request here. We convert it to a bigint[][] before sending it to the service layer. In the actual implemnetation, The controller accepts a bigint[][]
        this.clientServiceInstance.resultsRetrieval({qPrimeMatrix: qPrimeMatrix.values, qPrimePrimeMatrix: qPrimePrimeMatrix.values})
    }

}

module.exports = ClientController