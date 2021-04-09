"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const service_1 = __importDefault(require("../service"));
const attributesRepo_1 = __importDefault(require("../dataAccess/attributesRepo"));
const router = express_1.default.Router();
const galois = require('@guildofweavers/galois');
router.post('/acceptPSIRequest', async (req, res) => {
    console.log('Begin Client B Accept PSI', req.body);
    const requesterID = req.body.requesterID;
    const attributeRepoInstance = new attributesRepo_1.default();
    const acceptPSIRequestServiceInstance = typedi_1.Container.get(service_1.default);
    const { approved, password } = await acceptPSIRequestServiceInstance.acceptPSIRequest({ requesterID });
    if (!approved) {
        res.status(200).json({ status: 200, response: { success: false, text: 'PSI has been rejected' } });
    }
    const cloudConfig = await acceptPSIRequestServiceInstance.getCloudAttributes(attributeRepoInstance);
    const field = galois.createPrimeField(cloudConfig.finiteFieldNum);
    const mk = '1234';
    console.log('Client B password', password);
    console.log('Client B master key', mk);
    if (typeof requesterID === 'string') {
        console.log('Client B Accepted PSI request');
        acceptPSIRequestServiceInstance.computationDelegation({ requesterID, mk, cloudConfig, field }, attributeRepoInstance).then(() => {
            res.status(200).json({ status: 200, response: { success: true } });
        }).catch(err => {
            res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 });
        });
    }
    else {
        res.status(500).json({ error: { type: 'general', message: 'bad request' }, status: 500 });
    }
});
exports.default = router;
