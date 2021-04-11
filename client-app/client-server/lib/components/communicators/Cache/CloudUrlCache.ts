import { Service } from 'typedi'

// Singleton instance which caches the cloud url
@Service()
class CloudUrlCache {
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
