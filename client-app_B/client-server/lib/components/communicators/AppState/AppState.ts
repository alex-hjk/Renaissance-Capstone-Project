import IAppState from './IAppState'
import { Service } from 'typedi'
@Service()
class AppState implements IAppState {
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

    completePsi (intersectionResult?: {name: string, number: number}[]) {
      this.isPending = false
      this.intersectionResult = intersectionResult
      this.timeEnded = Date.now()
    }

    getIntersectionResult () : { timeTaken: number, intersectionResult: { name: string, number: number }[]
} | 'isPending' | void {
      if (this.isPending) {
        return 'isPending'
      } else if (this.intersectionResult && this.timeEnded && this.timeStarted) {
        return { intersectionResult: this.intersectionResult, timeTaken: this.timeEnded - this.timeStarted }
      }
    }
}

export default AppState
