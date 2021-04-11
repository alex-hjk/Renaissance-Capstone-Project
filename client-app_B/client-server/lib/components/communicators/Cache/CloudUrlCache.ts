import { Service } from 'typedi'
import ICloudUrlCache from './ICloudUrlCache'
// Singleton instance which caches the cloud url
@Service()
class CloudUrlCache implements ICloudUrlCache {
    cloudUrl?: string
    setCloudUrl = (cloudUrl: string) => {
      this.cloudUrl = cloudUrl
    }

    getCloudUrl = () : string => {
      if (!this.cloudUrl) {
        throw new Error('Cloud Url is undefined!')
      }
      return this.cloudUrl
    }
}

export default CloudUrlCache
