import express from 'express'
import GetIpAddressUtil from './GetIpAddressUtil'
import ClientController from '../../application/controller'
import ClientService from '../../application/service'
import ClientMemDB from '../../application/db/memDB'
import ClientMemDA from '../../application/dataAccess/memDA'
import CloudCommunicator from '../communicators/CloudCommunicator'
import { Container } from 'typedi'
import MarshallerUtil from '../communicators/Util/MarshallerUtil'

const router = express.Router()

const initServices = () => {
  const cloudCommunicator = new CloudCommunicator()
  const clientDBInstanceA = Container.get(ClientMemDB) // Singleton instance to persist storage
  const clientDA = new ClientMemDA(clientDBInstanceA)
  const clientA = new ClientService(cloudCommunicator, clientDA)
  const clientAController = new ClientController(clientA)
  return clientAController
}

router.post('/initClient', async (req, res) => {
  const clientController = initServices()
  const { masterKey, attributes, clientID } = req.body
  const clientIP = `http://${GetIpAddressUtil.getPrivateIpAndPort()}/api/psi`
  clientController.initClient({ masterKey, attributes, clientID, clientIP }).then((result: any) => {
    res.status(200).json({ ok: true, message: 'client initiated' })
  })
})

router.post('/initPSI', async (req, res) => {
  const clientController = initServices()
  const { requesteeID } = req.body
  clientController.initPSI({ requesteeID }).then((result: any) => {
    res.status(200).json({ ok: true, message: 'PSI Initiated' })
  })
})

router.post('/computationDelegation', async (req, res) => {
  const clientController = initServices()
  const { requesterID } = req.body
  clientController.computationDelegation({ requesterID }).then((result: any) => {
    res.status(200).json({ ok: true, message: 'Computation Delegation Initiated' })
  })
})

router.post('/resultsRetrieval', async (req, res) => {
  const clientController = initServices()
  const { qPrimeMatrix, qPrimePrimeMatrix } = req.body
  clientController.resultsRetrieval({ qPrimeMatrix: MarshallerUtil.unmarshallMatrix(qPrimeMatrix), qPrimePrimeMatrix: MarshallerUtil.unmarshallMatrix(qPrimePrimeMatrix) }).then((result:any) => {
    res.status(200).json({ ok: true, message: 'Result Retrieval Completed' })
  })
})

export default router
