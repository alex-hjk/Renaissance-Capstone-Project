import express from 'express'
import CloudMemDB from '../../../application/db'
import CloudMemDA from '../../../application/communicator' // This service is stateless
import CloudService from '../../../application/service'
import CloudController from '../../../application/controller'
import { Container } from 'typedi'
import MarshallerUtil from './Util/MarshallerUtil'

const router = express.Router()

const initClient = () => {
  const cloudDBInstance = Container.get(CloudMemDB)
  const cloudMemDA = new CloudMemDA(cloudDBInstance)
  const cloudServiceInstance = new CloudService(cloudMemDA)
  const cloudContoller = new CloudController(cloudServiceInstance)
  return cloudContoller
}

router.get('/getCloudConfig', async (req, res) => {
  const cloudControllerInstance = initClient()
  const cloudConfig = cloudControllerInstance.getCloudConfig()
  res.status(200).send({ cloudConfig: MarshallerUtil.marshallObject(cloudConfig) })
})

router.post('/getClientIP', async (req, res) => {
  const { clientID } = req.body
  const cloudControllerInstance = initClient()
  const clientIP = cloudControllerInstance.getClientIP({ clientID }).clientIP // getClientIP returns a client communicator instance
  res.status(200).send({ clientIP })
})

router.post('/saveClientAttributes', async (req, res) => {
  const { clientID, blindedValuesMatrix } = req.body
  const cloudControllerInstance = initClient()
  const unmarshalledBlindedValuesMatrix = MarshallerUtil.unmarshallMatrix(blindedValuesMatrix).values // TODO: Client should send a bigint[][] instead
  if (!unmarshalledBlindedValuesMatrix) {
    console.log('Error in saving client attributes. Make sure that the client ')
    res.status(433).send({ error: 'Send a JSMatrix for the blinded values' })
  }
  cloudControllerInstance.saveClientAttributes({ clientID, blindedValuesMatrix: unmarshalledBlindedValuesMatrix })
  res.status(200).send({ message: 'Clients Attributes saved' })
})

router.post('/saveClientIP', async (req, res) => {
  const { clientID, clientIP } = req.body
  const cloudControllerInstance = initClient()
  cloudControllerInstance.saveClientIP({ clientID, clientIP })
  res.status(200).send({ message: 'Clients IP saved' })
})

router.post('/resultsComputation', async (req, res) => {
  const { requesterID, qPrimeMatrix } = req.body
  const cloudControllerInstance = initClient()
  const unmarshalledQprimeMatrix = MarshallerUtil.unmarshallMatrix(qPrimeMatrix)
  cloudControllerInstance.resultsComputation({ requesterID, qPrimeMatrix: unmarshalledQprimeMatrix })
  res.status(200).send({ message: 'Results computation complete' })
})

export default router
