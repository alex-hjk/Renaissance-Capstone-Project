declare class IAppState {
  // sets isPending lock to true
  initPsi(): void;

  // sets isPending lock to false
  completePsi (intersectionResult?: {name: string, number: number}[], resultsRetrievalReq?: {qPrimeMatrix: any, qPrimePrimeMatrix: any}) : void;

  // returns the current pendingState of the app. If app is not pending, return void
  getIntersectionResult () : { timeTaken: number, resultsRetrievalReq:{qPrimeMatrix: any, qPrimePrimeMatrix: any}, intersectionResult: { name: string, number: number }[]
  } | 'isPending' | void
}

export default IAppState
