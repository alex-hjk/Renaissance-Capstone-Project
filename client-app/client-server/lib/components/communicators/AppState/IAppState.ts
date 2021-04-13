declare class IAppState {
  // sets isPending lock to true
  initPsi(): void;

  // sets isPending lock to false
  completePsi (intersectionResult?: {name: string, number: number}[]): void;

  // returns the current state of the app. If app is not pending, return void
  getIntersectionResult () : {name: string, number: number}[] | 'isPending' | void
}

export default IAppState