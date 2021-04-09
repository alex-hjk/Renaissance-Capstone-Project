"use strict";
const HashTableUtil = require('./HashTableUtil');
class BlindingFactorsUtil {
}
BlindingFactorsUtil.generateBlindingFactors = (masterKey, smallField, numBins, maximumLoad) => {
    const blindingFactors = HashTableUtil.initializeHashTable(numBins);
    for (let i = 0; i < numBins; i++) {
        const hashValueA = smallField.prng(BigInt(String(masterKey) + String(i * 20)));
        for (let j = 0; j < 2 * maximumLoad + 1; j++) {
            let blindingFactorA = smallField.prng(BigInt(String(hashValueA) + String(j * 20)));
            if (blindingFactorA === 0n) {
                blindingFactorA = 1n;
            }
            blindingFactors[i].push(blindingFactorA);
        }
    }
    return blindingFactors;
};
BlindingFactorsUtil.blindPointValues = (blindingFactors, hashTablePointValues, field) => {
    const blindingFactorsMatrix = field.newMatrixFrom(blindingFactors);
    const hashTablePointValueMatrix = field.newMatrixFrom(hashTablePointValues);
    const blindedValues = field.divMatrixElements(hashTablePointValueMatrix, blindingFactorsMatrix);
    return blindedValues;
};
module.exports = BlindingFactorsUtil;
