'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const typedi_1 = require('typedi')
const service_1 = __importDefault(require('../service'))
const attribute_1 = __importDefault(require('../entities/attribute'))
const attributesRepo_1 = __importDefault(require('../../dataAccess/attributes/attributesRepo'))
const Error_1 = require('../../../common/Error')
const router = express_1.default.Router()
const galois = require('@guildofweavers/galois')
router.post('/initClient', async (req, res) => {
  const clientID = req.body.clientID
  const attributeRepoInstance = new attributesRepo_1.default()
  const initClientServiceInstance = typedi_1.Container.get(service_1.default)
  const cloudConfig = await initClientServiceInstance.getCloudAttributes(attributeRepoInstance)
  console.log('Retreived communicators config')
  const field = galois.createPrimeField(cloudConfig.finiteFieldNum)
  const smallField = galois.createPrimeField(cloudConfig.smallFiniteFieldNum)
  const mk = '1234'
  const testAttributes = []
  testAttributes.push(new attribute_1.default('Collin', 1234, smallField, ({ name, number }) => 1428n))
  testAttributes.push(new attribute_1.default('Vincent', 1234, smallField, ({ name, number }) => 145n))
  initClientServiceInstance.initClient({ attributes: testAttributes, mk, cloudConfig, field, clientID }, attributeRepoInstance).then(({ blindedVectors }) => {
    const stringified = JSON.stringify(blindedVectors, (key, value) => typeof value === 'bigint'
      ? value.toString()
      : value)
    res.status(200).json({ status: 200, response: { blindedVectors: stringified } })
  }).catch(err => {
    let type = ''
    if (err instanceof Error_1.DatabaseError) {
      type = 'Database Error'
    } else if (err instanceof Error) {
      type = 'general'
    }
    res.status(500).json({ error: { type, name: err.name, message: err.message }, status: 500 })
  })
})
exports.default = router
