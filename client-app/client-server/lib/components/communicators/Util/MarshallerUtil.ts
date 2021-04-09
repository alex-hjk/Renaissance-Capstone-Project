
class MarshallerUtil {
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

    // Request takes in a string[][]
    static unmarshallMatrix = (object: string) : bigint[][] => {
      const matrix: bigint[][] = JSON.parse(object).map((elementArr: any[]) =>
        elementArr.map((value: string) => BigInt(value))
      )
      return matrix
    }
}

export default MarshallerUtil
