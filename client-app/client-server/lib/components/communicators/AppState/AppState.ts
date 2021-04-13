import IAppState from './IAppState'
import { Service } from 'typedi'
@Service()
class AppState implements IAppState {
    isPending?: boolean
    intersectionResult? : {name: string, number: number}[]
    initPsi () {
      this.isPending = true
      this.intersectionResult = undefined
    }

    completePsi (intersectionResult?: {name: string, number: number}[]) {
      this.isPending = false
      this.intersectionResult = intersectionResult
    }

    getIntersectionResult () : {name: string, number: number}[] | 'isPending' | void {
      if (this.isPending) {
        return 'isPending'
      } else if (this.intersectionResult) {
        return this.intersectionResult
      }
    }
}

export default AppState
