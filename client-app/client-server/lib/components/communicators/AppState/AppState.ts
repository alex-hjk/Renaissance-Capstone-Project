import IAppState from './IAppState'
import { Service } from 'typedi'
@Service()
class AppState implements IAppState {
    resultsRetrievalReq?: {qPrimeMatrix: any, qPrimePrimeMatrix: any}
    isPending?: boolean
    intersectionResult? : {name: string, number: number}[]
    timeStarted?: number
    timeEnded?: number

    initPsi () {
      this.isPending = true
      this.timeStarted = Date.now()
      this.timeEnded = undefined
      this.intersectionResult = undefined
    }

    completePsi (intersectionResult?: {name: string, number: number}[], resultsRetrievalReq?: {qPrimeMatrix: any, qPrimePrimeMatrix: any}) {
      this.isPending = false
      this.intersectionResult = intersectionResult
      this.timeEnded = Date.now()
      this.resultsRetrievalReq = resultsRetrievalReq
    }

    getIntersectionResult () : { timeTaken: number, resultsRetrievalReq:{qPrimeMatrix: any, qPrimePrimeMatrix: any}, intersectionResult: { name: string, number: number }[]
} | 'isPending' | void {
      if (this.isPending) {
        return 'isPending'
      } else if (this.intersectionResult && this.timeEnded && this.timeStarted && this.resultsRetrievalReq) {
        return { intersectionResult: this.intersectionResult, timeTaken: this.timeEnded - this.timeStarted, resultsRetrievalReq: this.resultsRetrievalReq }
      }
    }
}

export default AppState
