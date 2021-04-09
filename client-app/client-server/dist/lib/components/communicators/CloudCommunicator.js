"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MarshallerUtil_1 = __importDefault(require("./Util/MarshallerUtil"));
const ClientCommunicator_1 = __importDefault(require("./ClientCommunicator"));
const fetch = require('node-fetch');
const cloudOrigin = 'http://localhost:5001';
class CloudCommunicator {
    constructor() {
        this.cloudUrl = `${cloudOrigin}/api/psi`;
    }
    async getCloudConfig() {
        const response = await fetch(`${this.cloudUrl}/getCloudConfig`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const { cloudConfig } = await response.json();
        const { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER, SMALL_PRIME_NUMBER, vectorX } = JSON.parse(cloudConfig);
        return { NUMBER_OF_BINS, MAXIMUM_LOAD, LARGE_PRIME_NUMBER: BigInt(LARGE_PRIME_NUMBER), SMALL_PRIME_NUMBER: BigInt(SMALL_PRIME_NUMBER), vectorX: vectorX.map((x) => BigInt(x)) };
    }
    async getClientIP({ clientID }) {
        const response = await fetch(`${this.cloudUrl}/getClientIP`, {
            method: 'POST',
            body: JSON.stringify({ clientID }),
            headers: { 'Content-Type': 'application/json' }
        });
        const { clientIP } = await response.json();
        const clientCommunicator = new ClientCommunicator_1.default(clientIP);
        return clientCommunicator;
    }
    async saveClientAttributes({ clientID, blindedValuesMatrix }) {
        try {
            const marshalledBlindedValues = MarshallerUtil_1.default.marshallObject(blindedValuesMatrix);
            await fetch(`${this.cloudUrl}/saveClientAttributes`, { method: 'POST', body: JSON.stringify({ clientID, blindedValuesMatrix: marshalledBlindedValues }), headers: { 'Content-Type': 'application/json' } });
            console.log('Saved Client Attributes to the communicators');
        }
        catch (e) {
            throw new Error(`Error in saving client attributes:${e.message}`);
        }
    }
    async saveClientIP({ clientID, clientIP }) {
        try {
            await fetch(`${this.cloudUrl}/saveClientIP`, { method: 'POST', body: JSON.stringify({ clientID, clientIP }), headers: { 'Content-Type': 'application/json' } });
            console.log('Saved client IP to the communicators');
        }
        catch (e) {
            console.log(e.message, 'Error in Client Communicator, saveClientInstance');
        }
    }
    async resultsComputation({ requesterID, qPrimeMatrix }) {
        const marshalledQPrimeMatrix = MarshallerUtil_1.default.marshallObject(qPrimeMatrix);
        console.log(JSON.stringify({ requesterID, qPrimeMatrix: marshalledQPrimeMatrix }));
        const response = await fetch(`${this.cloudUrl}/resultsComputation`, { method: 'POST', body: JSON.stringify({ requesterID, qPrimeMatrix: marshalledQPrimeMatrix }), headers: { 'Content-Type': 'application/json' } });
        console.log('save client attributes');
    }
}
exports.default = CloudCommunicator;
