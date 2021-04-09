'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const typedi_1 = require('typedi')
const service_1 = __importDefault(require('../../initClient/service'))
const service_2 = __importDefault(require('../service'))
const attributesRepo_1 = __importDefault(require('../../dataAccess/attributes/attributesRepo'))
const marshallMatrix_1 = require('../../../common/util/marshallMatrix')
const router = express_1.default.Router()
const galois = require('@guildofweavers/galois')
router.post('/resultsRetrieval', async (req, res) => {
  console.log('Begin results retrieval')
  const qPrime = marshallMatrix_1.unmarshallGaloisMatrix(req.body.qPrime)
  const qPrimePrime = marshallMatrix_1.unmarshallGaloisMatrix(req.body.qPrimePrime)
  const attributeRepoInstance = new attributesRepo_1.default()
  const initClientServiceInstance = typedi_1.Container.get(service_1.default)
  const resultsRetrievalServiceInstance = typedi_1.Container.get(service_2.default)
  const cloudConfig = await initClientServiceInstance.getCloudAttributes(attributeRepoInstance)
  console.log('Retreived communicators config')
  const field = galois.createPrimeField(cloudConfig.finiteFieldNum)
  const mk = '1234'
  resultsRetrievalServiceInstance.resultsRetrieval({ qPrime, qPrimePrime, mk, cloudConfig, field }, attributeRepoInstance).then((commonAttributes) => {
    const stringified = JSON.stringify(commonAttributes, (key, value) => typeof value === 'bigint'
      ? value.toString()
      : value)
    res.status(200).json({ status: 200, response: { commonAttributes: stringified } })
  }).catch((err) => {
    res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 })
  })
})
exports.default = router
