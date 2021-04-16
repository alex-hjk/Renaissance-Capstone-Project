/**
 * Framework layer to inject all services into the controller layer
 */

import express from 'express'
import AppState from '../communicators/AppState/AppState'
import GetIpAddressUtil from './GetIpAddressUtil'
import ClientController from '../../application/controller'
import ClientService from '../../application/service'
import ClientMemDB from '../../application/db/memDB'
import ClientMemDA from '../../application/dataAccess/memDA'
import CloudCommunicator from '../communicators/CloudCommunicator'
import { Container } from 'typedi'
import MarshallerUtil from '../communicators/Util/MarshallerUtil'
import CloudUrlCache from '../communicators/Cache/CloudUrlCache'
import generateRandomNameAndNumbers from './TestDataUtil'

const router = express.Router()

const initServices = () => {
  const appState = Container.get(AppState) // Singleton instance to control the app pendingState
  const cloudUrlCache = Container.get(CloudUrlCache) // Singleton instance to set the cloud url
  const clientDBInstance = Container.get(ClientMemDB) // Singleton instance to persist storage
  const cloudCommunicator = new CloudCommunicator(cloudUrlCache)
  const clientDA = new ClientMemDA(clientDBInstance)
  const client = new ClientService(cloudCommunicator, clientDA, appState)
  const clientController = new ClientController(client)
  return clientController
}

const setCloudUrl = (cloudUrl: string) => {
  const cloudUrlCache = Container.get(CloudUrlCache)
  cloudUrlCache.setCloudUrl(cloudUrl) // Sets the cloud url on init client. Any services after that will use the cloud url set here
}

router.post('/initClient', async (req, res) => {
  try {
    const { masterKey, clientID, cloudUrl, testSize } = req.body
    let { attributes } = req.body
    // testSize is accepted if we want to test more attributes
    if (testSize) {
      attributes = generateRandomNameAndNumbers(testSize)
    }
    setCloudUrl(cloudUrl)
    const clientController = initServices()
    const clientIP = `http://${GetIpAddressUtil.getPrivateIpAndPort()}/api/psi`
    clientController.initClient({ masterKey, attributes, clientID, clientIP }).then((result: any) => {
      res.status(200).json({ ok: true, message: 'client initiated' })
    }).catch(e => {
      res.status(500).json({ ok: false, message: e.message })
    })
  } catch (e) {
    res.status(200).json({ ok: false, message: e.message })
  }
})

router.post('/initPSI', async (req, res) => {
  try {
    const clientController = initServices()
    const { requesteeID } = req.body
    clientController.initPSI({ requesteeID }).then((result: any) => {
      res.status(200).json({ ok: true, message: 'PSI Initiated' })
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

router.post('/computationDelegation', async (req, res) => {
  try {
    const clientController = initServices()
    const { requesterID } = req.body
    clientController.computationDelegation({ requesterID }).then((result: any) => {
      res.status(200).json({ ok: true, message: 'Computation Delegation Initiated' })
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

router.post('/resultsRetrieval', async (req, res) => {
  try {
    const clientController = initServices()
    const { qPrimeMatrix, qPrimePrimeMatrix } = req.body
    clientController.resultsRetrieval({ qPrimeMatrix: MarshallerUtil.unmarshallMatrix(qPrimeMatrix), qPrimePrimeMatrix: MarshallerUtil.unmarshallMatrix(qPrimePrimeMatrix) }).then((result:any) => {
      res.status(200).json({ ok: true, message: 'Result Retrieval Completed' })
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

router.get('/getIntersectionResult', async (req, res) => {
  try {
    const clientController = initServices()
    const intersectionResult : { intersectionResult: { name: string, number: number }[], timeTaken: number }| 'isPending' | void = clientController.getIntersectionResult() // Can be void
    const status = intersectionResult === 'isPending' ? 'pending' : 'completed or error occured'
    const result = (intersectionResult && intersectionResult !== 'isPending') ? intersectionResult : undefined
    res.status(200).json({ status, ...result })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

router.get('/getAttributes', async (req, res) => {
  try {
    const clientController = initServices()
    const attributes : {name: string, number: number}[] | undefined = clientController.getAttributes() // Can be void
    res.status(200).json({ attributes })
  } catch (e) {
    res.status(200).json({ ok: false, message: e.message }) // Return status 200 because we assume that error is due to client not being initialized
  }
})

export default router
