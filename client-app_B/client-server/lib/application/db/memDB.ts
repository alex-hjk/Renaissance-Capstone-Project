import { Service } from 'typedi'

// Simulates the postgres DB --> All these values should be stored in strings
@Service()
class ClientMemDB {
    clientID? : string;
    masterKey? : number;
    attributes? : any;
    blindedValuesMatrix? : any;
    blindingFactors? : any;
}

export default ClientMemDB
