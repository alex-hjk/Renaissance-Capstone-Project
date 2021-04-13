
// Singleton instance which caches the cloud url
declare class ICloudUrlCache {
    cloudUrl?: string
    setCloudUrl (cloudUrl: string) : void;
    getCloudUrl () : string;
}

export default ICloudUrlCache
