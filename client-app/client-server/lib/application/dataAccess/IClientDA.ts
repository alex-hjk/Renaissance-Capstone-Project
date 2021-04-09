interface IClientDA {
    saveClientID (clientID: string) : void
    saveMasterKey (masterKey: number) : void
    saveAttributes (attributes : any) : void
    saveBlindedValuesMatrix (blindedValuesMatrix: any) : void
    saveBlindingFactors (blindingFactors: any) : void
    getClientID () : string
    getMasterKey () : number
    getAttributes () : any
    getBlindedValuesMatrix () : any
    getBlindingFactors (): any
}

export default IClientDA
