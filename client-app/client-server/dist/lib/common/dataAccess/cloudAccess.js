"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultsComputationFetch = exports.getCloudConfigFetch = exports.initClientFetch = void 0;
const cloud_1 = require("../../config/cloud");
const fetch = require('node-fetch');
const cloudUrl = `${cloud_1.cloudOrigin}/api/`;
const initClientCloudEndpoint = cloudUrl + 'initClient/initClient';
const getCloudConfigEndpoint = cloudUrl + 'initClient/getCloudConfig';
const resultsComputationEndpoint = cloudUrl + 'resultsComputation/resultsComputation';
const initClientFetch = (blindedVectors, url, clientID) => {
    return fetch(initClientCloudEndpoint, { method: 'POST', body: JSON.stringify({ blindedVectors, url, clientID }), headers: { 'Content-Type': 'application/json' } });
};
exports.initClientFetch = initClientFetch;
const getCloudConfigFetch = () => fetch(getCloudConfigEndpoint);
exports.getCloudConfigFetch = getCloudConfigFetch;
const resultsComputationFetch = (qMatrix, requesterID, requesteeID) => {
    return fetch(resultsComputationEndpoint, { method: 'POST', body: JSON.stringify({ qMatrix, requesterID, requesteeID }), headers: { 'Content-Type': 'application/json' } });
};
exports.resultsComputationFetch = resultsComputationFetch;
