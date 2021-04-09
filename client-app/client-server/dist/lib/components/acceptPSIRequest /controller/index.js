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
    const requesterID = req.body.requesterID;
    const attributeRepoInstance = new attributesRepo_1.default();
    const acceptPSIRequestServiceInstance = typedi_1.Container.get(service_1.default);
    const { approved, password } = await acceptPSIRequestServiceInstance.acceptPSIRequest({ requesterID });
    if (!approved) {
        res.status(200).json({ status: 200, response: { success: false } });
    }
    const cloudConfig = await acceptPSIRequestServiceInstance.getCloudAttributes(attributeRepoInstance);
    const field = galois.createPrimeField(cloudConfig.finiteFieldNum);
    const mk = field.prng(password).toString();
    const hashedmk = 'hashedmk';
    if (hashedmk !== mk) {
        res.status(500).json({ error: { type: 'general', message: 'password incorrect' }, status: 500 });
    }
    if (typeof requesterID === 'string') {
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
