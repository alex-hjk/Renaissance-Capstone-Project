"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const service_1 = __importDefault(require("../service"));
const configRepo_1 = __importDefault(require("../../configDA/dataAccess/configRepo"));
const router = express_1.default.Router();
router.post('/initPSI', async (req, res) => {
    const requesteeID = req.body.requesteeID;
    const requesteeIP = req.body.requesteeIP || 'http://client-server-b:5002';
    const initPSIServiceInstance = typedi_1.Container.get(service_1.default);
    const configRepoInstance = new configRepo_1.default();
    initPSIServiceInstance.initPSI({ requesteeID, requesteeIP }, configRepoInstance).then(() => {
        res.status(200).json({ status: 200, response: { success: true, message: 'PSI Initiated' } });
    }).catch(err => {
        res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 });
    });
});
exports.default = router;
