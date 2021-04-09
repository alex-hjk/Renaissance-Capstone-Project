"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudConfig_1 = __importDefault(require("../entities/cloudConfig"));
const cloudAccess_1 = require("../../../common/dataAccess/cloudAccess");
const dbAccess_1 = require("../../../common/dataAccess/dbAccess");
const Error_1 = require("../../../common/Error");
class AttributesRepo {
    constructor() {
        this.saveAttributesLocal = async (attributes) => {
            try {
                const queryString = `insert into client.attributes (hashed_value, name, phone) values ${attributes.map((attr) => `(${attr.getHashedValue()}, '${attr.name}', ${attr.number})`).join(',')} on conflict do nothing`;
                await dbAccess_1.query(queryString);
            }
            catch (e) {
                throw new Error_1.DatabaseError(e.message);
            }
        };
    }
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
    async saveAttributesCloud(blindedVectors, clientID) {
        const stringified = JSON.stringify(blindedVectors, (key, value) => typeof value === 'bigint'
            ? value.toString()
            : value);
        await cloudAccess_1.initClientFetch(stringified, clientID);
    }
}
exports.default = AttributesRepo;
