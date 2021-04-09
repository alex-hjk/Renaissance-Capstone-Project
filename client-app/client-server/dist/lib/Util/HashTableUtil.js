"use strict";
const AttributeUtil = require("./AttributeUtil");
class HashTableUtil {
}
HashTableUtil.initializeHashTable = (numBins) => {
    const hashTable = [];
    for (let i = 0; i < numBins; i++) {
        hashTable[i] = [];
    }
    return hashTable;
};
HashTableUtil.getHashTableFromAttributes = (attributes, numBins, maximumLoad, smallField, smallPrimeNumber) => {
    const concatenateAttributes = (attributes, smallField, smallPrimeNumber) => {
        const concatenatedAttributes = attributes.map(attribute => {
            return AttributeUtil.concatenateAttribute(attribute, smallField, smallPrimeNumber);
        });
        return concatenatedAttributes;
    };
    const hashAttributesToBins = (concatenatedAttributes, numBins) => {
        const hashTable = HashTableUtil.initializeHashTable(numBins);
        concatenatedAttributes.forEach(attribute => {
            const binValue = Number(attribute) % numBins;
            hashTable[binValue].push(attribute);
        });
        return hashTable;
    };
    const padBinsInHashTable = (numBins, maximumLoad, hashTable) => {
        for (let i = 0; i < numBins; i++) {
            const values = hashTable[i].length;
            for (let j = 0; j < maximumLoad - values; j++) {
                hashTable[i].push(0n);
            }
        }
    };
    const concatenatedAttributes = concatenateAttributes(attributes, smallField, smallPrimeNumber);
    const hashTable = hashAttributesToBins(concatenatedAttributes, numBins);
    padBinsInHashTable(numBins, maximumLoad, hashTable);
    return hashTable;
};
HashTableUtil.generatePointValueFromHashTable = (vectorX, largeField, numBins, hashTable) => {
    const hashTablePointValue = HashTableUtil.initializeHashTable(numBins);
    vectorX.forEach(x => {
        for (let i = 0; i < numBins; i++) {
            let answer = 1n;
            hashTable[i].forEach(root => {
                answer = largeField.mul(answer, largeField.sub(x, root));
            });
            hashTablePointValue[i].push(answer);
        }
    });
    return hashTablePointValue;
};
module.exports = HashTableUtil;
