"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientController {
    constructor(clientServiceInstance) {
        this.clientServiceInstance = clientServiceInstance;
    }
    initClient(request) {
        const { masterKey, attributes, clientID, clientIP } = request;
        if (!masterKey) {
            throw new Error('Master Key is not defined');
        }
        if (!attributes || !attributes.length) {
            throw new Error('Attributes must be an array and non 0');
        }
        if (!clientID) {
            throw new Error('Client ID is not defined');
        }
        return new Promise((resolve, reject) => {
            resolve(this.clientServiceInstance.initClient({ masterKey, attributes, clientID, clientIP }));
        });
    }
    initPSI(request) {
        const { requesteeID } = request;
        return new Promise((resolve, reject) => {
            resolve(this.clientServiceInstance.initPSI({ requesteeID }));
        });
    }
    computationDelegation(request) {
        const { requesterID } = request;
        return new Promise((resolve, reject) => {
            resolve(this.clientServiceInstance.computationDelegation({ requesterID }));
        });
    }
    resultsRetrieval(request) {
        const { qPrimeMatrix, qPrimePrimeMatrix } = request;
        return new Promise((resolve, reject) => {
            resolve(this.clientServiceInstance.resultsRetrieval({ qPrimeMatrix, qPrimePrimeMatrix }));
        });
    }
    getIntersectionResult() {
        return this.clientServiceInstance.getIntersectionResult();
    }
    getAttributes() {
        return this.clientServiceInstance.getAttributes();
    }
}
exports.default = ClientController;
