"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AcceptPSIRequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const galois = require('@guildofweavers/galois');
let AcceptPSIRequestService = AcceptPSIRequestService_1 = class AcceptPSIRequestService {
    async getCloudAttributes(dataAccess) {
        return dataAccess.getCloudConfig();
    }
    async acceptPSIRequest({ requesterID: string }) {
        const approved = true;
        const password = '1234';
        return { approved, password };
    }
    async computationDelegation({ requesterID, mk, cloudConfig, field }, dataAccess) {
        console.log('Client B begin computation delegation');
        const qMatrix = this.calculateQMatrix(mk, cloudConfig, field);
        const requesteeID = 'B';
        console.log('Client B generated qMatrix from master key');
        await dataAccess.resultsComputation(qMatrix, requesterID, requesteeID);
    }
    calculateQMatrix(mk, cloudConfig, field) {
        const tk = 321n;
        const randomPolynomialA = [];
        const blindingFactorsA = [];
        for (let i = 0; i < cloudConfig.numBins; i++) {
            randomPolynomialA[i] = [];
            blindingFactorsA[i] = [];
        }
        for (let i = 0; i < cloudConfig.numBins; i++) {
            const hashValue = field.prng(BigInt(String(tk) + String(i * 20)));
            for (let j = 0; j < cloudConfig.numElementsPerBin + 1; j++) {
                const coefficient = field.prng(BigInt(String(hashValue) + String(j * 20)));
                randomPolynomialA[i].push(coefficient);
            }
        }
        const randomPolynomialA_PointValue = [];
        randomPolynomialA.forEach((randomPolynomialInBin) => {
            const polyArray = [];
            cloudConfig.vectorX.forEach(x => {
                polyArray.push(field.evalPolyAt(field.newVectorFrom(randomPolynomialInBin), x));
            });
            randomPolynomialA_PointValue.push(polyArray);
        });
        const randomPolynomialAMatrix = field.newMatrixFrom(randomPolynomialA_PointValue);
        const hashField = galois.createPrimeField(cloudConfig.smallFiniteFieldNum);
        const blindingVectors = AcceptPSIRequestService_1.generateBlindingVectors(mk, cloudConfig.numBins, cloudConfig.numElementsPerBin, hashField, blindingFactorsA);
        const blindingFactorsAMatrix = field.newMatrixFrom(blindingVectors);
        const qValuesAMatrix = field.mulMatrixElements(randomPolynomialAMatrix, blindingFactorsAMatrix);
        return qValuesAMatrix;
    }
    static generateBlindingVectors(mk, numBins, numElementsPerBin, hashField, blindingFactorsA) {
        const temp = [...blindingFactorsA];
        for (let i = 0; i < numBins; i++) {
            const hashValueA = hashField.prng(BigInt(String(mk) + String(i * 20)));
            for (let j = 0; j < 2 * numElementsPerBin + 1; j++) {
                let blindingFactorA = hashField.prng(BigInt(String(hashValueA) + String(j * 20)));
                if (blindingFactorA === 0n) {
                    blindingFactorA = 1n;
                }
                temp[i].push(blindingFactorA);
            }
        }
        return temp;
    }
};
AcceptPSIRequestService = AcceptPSIRequestService_1 = __decorate([
    typedi_1.Service()
], AcceptPSIRequestService);
exports.default = AcceptPSIRequestService;
