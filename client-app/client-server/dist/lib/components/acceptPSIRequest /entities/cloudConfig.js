"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CloudConfig {
    constructor(numBins, numElementsPerBin, finiteFieldNum, smallFiniteFieldNum, vectorX) {
        this.numBins = numBins;
        this.numElementsPerBin = numElementsPerBin;
        this.finiteFieldNum = finiteFieldNum;
        this.smallFiniteFieldNum = smallFiniteFieldNum;
        this.vectorX = vectorX;
    }
}
exports.default = CloudConfig;
