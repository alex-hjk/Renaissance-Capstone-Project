// This class helps to communicate with the requestee client
import IClientCommunicator from './IClientCommunicator'
const fetch = require('node-fetch')
class ClientCommunicator implements IClientCommunicator {
    clientIP: string // The IP address we are trying to communicate with
    constructor (clientIP: string) {
      this.clientIP = clientIP
    }

    async computationDelegation ({ requesterID } : {requesterID: string}) {
      const clientUrl = `${this.clientIP}/computationDelegation`
      console.log(this.clientIP)
      await fetch(clientUrl, { method: 'POST', body: JSON.stringify({ requesterID }), headers: { 'Content-Type': 'application/json' } })
      console.log('Called computation delegation in requestee object')
    }
}

export default ClientCommunicator
