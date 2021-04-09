"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ResultsRetrievalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const attribute_1 = __importDefault(require("../../entities/attribute"));
const concat_1 = require("../../../common/util/concat");
const galois = require('@guildofweavers/galois');
let ResultsRetrievalService = ResultsRetrievalService_1 = class ResultsRetrievalService {
    async resultsRetrieval({ qPrime, qPrimePrime, mk, cloudConfig, field }, dataAccess) {
        const _qPrime = field.newMatrixFrom(qPrime);
        const _qPrimePrime = field.newMatrixFrom(qPrimePrime);
        const localAttributesUnmarshalled = await dataAccess.getLocalAttributes();
        const localAttributes = localAttributesUnmarshalled.map(({ hashed_value, name, phone }) => {
            return new attribute_1.default(name, phone, { hashedValue: hashed_value });
        });
        const hashField = galois.createPrimeField(cloudConfig.smallFiniteFieldNum);
        const blindingFactorsA = ResultsRetrievalService_1.generateBlindingFactors(mk, cloudConfig.numBins, cloudConfig.numElementsPerBin, hashField);
        const resultPolynomial = ResultsRetrievalService_1.getResultantPolynomial(_qPrime, _qPrimePrime, blindingFactorsA, cloudConfig, field);
        console.log('Result polynomial');
        const intersectionResult = ResultsRetrievalService_1.factorisePolynomial(resultPolynomial, localAttributes, cloudConfig, field, hashField);
        console.log('Final Intersection:', intersectionResult);
        return intersectionResult;
    }
    static generateBlindingFactors(mk, numBins, numElementsPerBin, hashField) {
        console.log('Generating blinding factors');
        const blindingFactorsA = [];
        for (let i = 0; i < numBins; i++) {
            const hashValueA = hashField.prng(BigInt(String(mk) + String(i * 20)));
            blindingFactorsA.push([]);
            for (let j = 0; j < 2 * numElementsPerBin + 1; j++) {
                let blindingFactorA = hashField.prng(BigInt(String(hashValueA) + String(j * 20)));
                if (blindingFactorA === 0n) {
                    blindingFactorA = 1n;
                }
                blindingFactorsA[i].push(blindingFactorA);
            }
        }
        console.log('Blinding factors generated');
        return hashField.newMatrixFrom(blindingFactorsA);
    }
    static getResultantPolynomial(qPrime, qPrimePrime, blindingFactors, cloudConfig, field) {
        console.log('Starting get resultant polynomial');
        try {
            const gMatrix = field.addMatrixElements(qPrime, field.mulMatrixElements(qPrimePrime, blindingFactors));
            console.log('GMATRIX', gMatrix);
            const gValues = gMatrix.toValues();
            const resultantPolynomial = [];
            for (let i = 0; i < cloudConfig.numBins; i++) {
                const polynomialYVector = field.newVectorFrom(gValues[i]);
                const result = field.interpolate(field.newVectorFrom(cloudConfig.vectorX), polynomialYVector);
                resultantPolynomial.push(result);
            }
            return resultantPolynomial;
        }
        catch (e) {
            console.log('ERROR:', e.message);
            throw new Error(e.message);
        }
    }
    static factorisePolynomial(resultantPolynomial, attributes, cloudConfig, field, hashField) {
        console.log('Starting factorization');
        const hashTableClient = [];
        for (let i = 0; i < cloudConfig.numBins; i++) {
            hashTableClient[i] = [];
        }
        const hashedAttributes = attributes.map((att) => (att.getHashedValue()));
        hashedAttributes.forEach(attribute => {
            const concateAttr = concat_1.concatenateAttribute(attribute, hashField, cloudConfig.smallFiniteFieldNum);
            const binValue = Number(concateAttr) % cloudConfig.numBins;
            hashTableClient[binValue].push(concateAttr);
        });
        console.log('hashTableClient:', hashTableClient);
        const answerArray = [];
        for (let i = 0; i < cloudConfig.numBins; i++) {
            const binAnswerArray = [];
            hashTableClient[i].forEach(attribute => {
                const yValue = field.evalPolyAt(resultantPolynomial[i], BigInt(attribute));
                if (yValue === 0n) {
                    binAnswerArray.push(attribute);
                }
            });
            answerArray.push(binAnswerArray);
        }
        const realAnswerArray = [];
        answerArray.forEach(bin => {
            if (bin.length !== 0) {
                bin.forEach(answer => {
                    const { realValue, value } = concat_1.checkHashValue(answer, hashField, cloudConfig.smallFiniteFieldNum);
                    if (realValue) {
                        realAnswerArray.push(BigInt(value));
                    }
                });
            }
        });
        const commonAttributesNames = [];
        console.log(realAnswerArray);
        attributes.forEach(attribute => {
            if (realAnswerArray.includes(attribute.getHashedValue())) {
                commonAttributesNames.push(attribute.name);
            }
        });
        return commonAttributesNames;
    }
};
ResultsRetrievalService = ResultsRetrievalService_1 = __decorate([
    typedi_1.Service()
], ResultsRetrievalService);
exports.default = ResultsRetrievalService;
