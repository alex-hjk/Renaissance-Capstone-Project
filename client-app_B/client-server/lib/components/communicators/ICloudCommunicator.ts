import IClientCommunicator from './IClientCommunicator'

declare class ICloudCommunicator {
  getCloudConfig () : Promise<{NUMBER_OF_BINS: number, MAXIMUM_LOAD: number, LARGE_PRIME_NUMBER: bigint, SMALL_PRIME_NUMBER: bigint, vectorX: bigint[] }>

  getClientIP ({ clientID }: {clientID: string}): Promise<IClientCommunicator>

  saveClientAttributes ({ clientID, blindedValuesMatrix }: {clientID: string, blindedValuesMatrix: any}): Promise<void>

  saveClientIP ({ clientID, clientIP }: {clientID: string, clientIP: string}): Promise<void>

  resultsComputation ({ requesterID, qPrimeMatrix }: {requesterID: string, qPrimeMatrix: any}) : Promise<void>
}

export default ICloudCommunicator
