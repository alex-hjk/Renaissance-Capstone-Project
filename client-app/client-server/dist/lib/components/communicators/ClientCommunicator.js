"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require('node-fetch');
class ClientCommunicator {
    constructor(clientIP) {
        this.clientIP = clientIP;
    }
    async computationDelegation({ requesterID }) {
        const clientUrl = `${this.clientIP}/computationDelegation`;
        console.log(this.clientIP);
        await fetch(clientUrl, { method: 'POST', body: JSON.stringify({ requesterID }), headers: { 'Content-Type': 'application/json' } });
        console.log('Called computation delegation in requestee object');
    }
}
exports.default = ClientCommunicator;
