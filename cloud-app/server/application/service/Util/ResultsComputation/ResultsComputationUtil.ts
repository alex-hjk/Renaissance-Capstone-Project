
const RandomPolynomialUtil = require('../RandomPolynomialUtil')

class ResultsComputationUtil {
    /**
     *
     * @param blindedValuesRequesterMatrix
     * @param field
     * @param numBins
     * @param maximumLoad
     * @param tempKey
     * @param vectorX
     * @returns {Matrix}
     */
    static generateQPrimePrimeMatrix = (blindedValuesRequesterMatrix: bigint[][], field: any, numBins: number, maximumLoad: number, tempKey: bigint, vectorX: any) => {
      const randomPolynomialPointValue = RandomPolynomialUtil.generateRandomPolynomialPointValue(field, numBins, maximumLoad, tempKey, vectorX)
      const randomPolynomialMatrix = field.newMatrixFrom(randomPolynomialPointValue)
      const qPrimePrimeMatrix = field.mulMatrixElements(randomPolynomialMatrix, field.newMatrixFrom(blindedValuesRequesterMatrix))
      return qPrimePrimeMatrix
    }
}

export default ResultsComputationUtil
