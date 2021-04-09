declare class IClientCommunicator {
  computationDelegation({ requesterID } : {requesterID: string}) : Promise<void>
}

export default IClientCommunicator
