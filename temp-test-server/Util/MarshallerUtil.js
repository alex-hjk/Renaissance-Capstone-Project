class MarshallerUtil {
    /**
     * Helps to ensure that all big int values are serialized
     * @param object
     */
    static marshallObject = (object) => {
      const stringified = JSON.stringify(object, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
      )
      return stringified
    }

    static unmarshallMatrix = (data) => {
        const matrix = JSON.parse(data).values
        for (let i = 0; i < matrix.length; i++) {
            matrix[i].forEach((att, j) => {
                matrix[i][j] = BigInt(att)
            })
        }
        return matrix
    }
}

module.exports = MarshallerUtil
