"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudConfig_1 = __importDefault(require("../entities/cloudConfig"));
const cloudAccess_1 = require("../../../common/dataAccess/cloudAccess");
class AttributesRepo {
    async getCloudConfig() {
        const res = await cloudAccess_1.getCloudConfigFetch();
        const { cloudConfig: cloudConfigString } = await res.json();
        const cloudConfig = JSON.parse(cloudConfigString);
        const numBins = cloudConfig.numBins;
        const numElementsPerBin = cloudConfig.numElementsPerBin;
        const finiteFieldNum = BigInt(cloudConfig.finiteFieldNum);
        const smallFiniteFieldNum = BigInt(cloudConfig.smallFiniteFieldNum);
        const vectorX = cloudConfig.vectorX.map((x) => BigInt(x));
        return new cloudConfig_1.default(numBins, numElementsPerBin, finiteFieldNum, smallFiniteFieldNum, vectorX);
    }
    async resultsComputation(qMatrix, requesterID, requesteeID) {
        const stringified = JSON.stringify(qMatrix, (key, value) => typeof value === 'bigint'
            ? value.toString()
            : value);
        await cloudAccess_1.resultsComputationFetch(stringified, requesterID, requesteeID);
    }
}
exports.default = AttributesRepo;
