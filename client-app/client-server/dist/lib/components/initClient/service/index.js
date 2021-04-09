"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InitClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const concat_1 = require("../../../common/util/concat");
const galois = require('@guildofweavers/galois');
let InitClientService = InitClientService_1 = class InitClientService {
    async getCloudAttributes(dataAccess) {
        return dataAccess.getCloudConfig();
    }
    async initClient({ clientID, attributes, mk, cloudConfig, field }, dataAccess) {
        console.log('init client');
        attributes.forEach((attribute) => { console.log(attribute.getHashedValue()); });
        await dataAccess.saveAttributesLocal(attributes);
        console.log('Saved data to local DB');
        const smallField = galois.createPrimeField(cloudConfig.smallFiniteFieldNum);
        const blindedVectors = this.computeBlindedVectors(attributes, mk, cloudConfig, field, smallField);
        await dataAccess.saveAttributesCloud(blindedVectors, clientID);
        return { blindedVectors };
    }
    computeBlindedVectors(attributes, mk, cloudConfig, field, smallField) {
        const hashTableClientA = [];
        const hashTablePointValueA = [];
        const blindingFactorsA = [];
        const blindedValuesA = [];
        for (let i = 0; i < cloudConfig.numBins; i++) {
            hashTableClientA[i] = [];
            hashTablePointValueA[i] = [];
            blindingFactorsA[i] = [];
            blindedValuesA[i] = [];
        }
        const hashedAttributes = attributes.map((att) => (att.getHashedValue()));
        hashedAttributes.forEach(attribute => {
            const concatenatedAttribute = concat_1.concatenateAttribute(attribute, smallField, cloudConfig.smallFiniteFieldNum);
            const binValue = Number(concatenatedAttribute) % cloudConfig.numBins;
            hashTableClientA[binValue].push(concatenatedAttribute);
        });
        for (let i = 0; i < cloudConfig.numBins; i++) {
            const valuesInBinA = hashTableClientA[i].length;
            for (let j = 0; j < cloudConfig.numElementsPerBin - valuesInBinA; j++) {
                hashTableClientA[i].push(0n);
            }
        }
        console.log('created client hash table');
        cloudConfig.vectorX.forEach(x => {
            for (let i = 0; i < cloudConfig.numBins; i++) {
                let answer = 1n;
                hashTableClientA[i].forEach(root => {
                    answer = field.mul(answer, field.sub(x, root));
                });
                hashTablePointValueA[i].push(answer);
            }
        });
        InitClientService_1.generateBlindingVectors(mk, cloudConfig.numBins, cloudConfig.numElementsPerBin, smallField, blindingFactorsA);
        const blindedValuesAMatrix = InitClientService_1.generateBlindedValues(blindingFactorsA, hashTablePointValueA, field);
        return blindedValuesAMatrix;
    }
    static generateBlindingVectors(mk, numBins, numElementsPerBin, hashField, blindingFactorsA) {
        console.log(BigInt(String(mk)));
        for (let i = 0; i < numBins; i++) {
            const hashValueA = hashField.prng(BigInt(String(mk) + String(i * 20)));
            for (let j = 0; j < 2 * numElementsPerBin + 1; j++) {
                let blindingFactorA = hashField.prng(BigInt(String(hashValueA) + String(j * 20)));
                if (blindingFactorA === 0n) {
                    blindingFactorA = 1n;
                }
                blindingFactorsA[i].push(blindingFactorA);
            }
        }
        console.log(blindingFactorsA);
    }
    static generateBlindedValues(blindingFactorsA, hashTablePointValueA, field) {
        const blindingFactorsAMatrix = field.newMatrixFrom(blindingFactorsA);
        const hashTablePointValueAMatrix = field.newMatrixFrom(hashTablePointValueA);
        const blindedValuesAMatrix = field.divMatrixElements(hashTablePointValueAMatrix, blindingFactorsAMatrix);
        return blindedValuesAMatrix;
    }
};
InitClientService = InitClientService_1 = __decorate([
    typedi_1.Service()
], InitClientService);
exports.default = InitClientService;
