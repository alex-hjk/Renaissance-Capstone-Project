
class MarshallerUtil {

    static marshallGaloisMatrixToBigIntArr = (object: any) => {
        const stringified = MarshallerUtil.marshallObject(object.values);
        return stringified
    }

    /**
     * Helps to ensure that all big int values are serialized
     * @param object
     */
    static marshallObject = (object: any) => {
      const stringified = JSON.stringify(object, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
      )
      return stringified
    }

    // TODO: request string should be a bigint[][] instead
    static unmarshallMatrix = (object: any) : bigint[][] => {
      const matrix = JSON.parse(object)
      matrix.values = matrix.values.map((elementArr: any[]) =>
        elementArr.map((value: string) => BigInt(value))
      )
      return matrix
    }
}

export default MarshallerUtil
