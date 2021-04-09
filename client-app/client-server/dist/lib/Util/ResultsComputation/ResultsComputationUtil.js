"use strict";
const RandomPolynomialUtil = require('../RandomPolynomialUtil');
class ResultsComputationUtil {
}
ResultsComputationUtil.generateQPrimePrimeMatrix = (blindedValuesRequesterMatrix, field, numBins, maximumLoad, tempKey, vectorX) => {
    const randomPolynomialPointValue = RandomPolynomialUtil.generateRandomPolynomialPointValue(field, numBins, maximumLoad, tempKey, vectorX);
    const randomPolynomialMatrix = field.newMatrixFrom(randomPolynomialPointValue);
    const qPrimePrimeMatrix = field.mulMatrixElements(randomPolynomialMatrix, field.newMatrixFrom(blindedValuesRequesterMatrix));
    return qPrimePrimeMatrix;
};
module.exports = ResultsComputationUtil;
