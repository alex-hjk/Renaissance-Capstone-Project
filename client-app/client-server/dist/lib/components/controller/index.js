"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetIpAddressUtil_1 = __importDefault(require("./GetIpAddressUtil"));
const controller_1 = __importDefault(require("../../application/controller"));
const service_1 = __importDefault(require("../../application/service"));
const memDB_1 = __importDefault(require("../../application/db/memDB"));
const memDA_1 = __importDefault(require("../../application/dataAccess/memDA"));
const CloudCommunicator_1 = __importDefault(require("../communicators/CloudCommunicator"));
const typedi_1 = require("typedi");
const MarshallerUtil_1 = __importDefault(require("../communicators/Util/MarshallerUtil"));
const router = express_1.default.Router();
const initServices = () => {
    const cloudCommunicator = new CloudCommunicator_1.default();
    const clientDBInstanceA = typedi_1.Container.get(memDB_1.default);
    const clientDA = new memDA_1.default(clientDBInstanceA);
    const clientA = new service_1.default(cloudCommunicator, clientDA);
    const clientAController = new controller_1.default(clientA);
    return clientAController;
};
router.post('/initClient', async (req, res) => {
    const clientController = initServices();
    const { masterKey, attributes, clientID } = req.body;
    const clientIP = `http://${GetIpAddressUtil_1.default.getPrivateIpAndPort()}/api/psi`;
    clientController.initClient({ masterKey, attributes, clientID, clientIP }).then((result) => {
        res.status(200).json({ ok: true, message: 'client initiated' });
    });
});
router.post('/initPSI', async (req, res) => {
    const clientController = initServices();
    const { requesteeID } = req.body;
    clientController.initPSI({ requesteeID }).then((result) => {
        res.status(200).json({ ok: true, message: 'PSI Initiated' });
    });
});
router.post('/computationDelegation', async (req, res) => {
    const clientController = initServices();
    const { requesterID } = req.body;
    clientController.computationDelegation({ requesterID }).then((result) => {
        res.status(200).json({ ok: true, message: 'Computation Delegation Initiated' });
    });
});
router.post('/resultsRetrieval', async (req, res) => {
    const clientController = initServices();
    const { qPrimeMatrix, qPrimePrimeMatrix } = req.body;
    clientController.resultsRetrieval({ qPrimeMatrix: MarshallerUtil_1.default.unmarshallMatrix(qPrimeMatrix), qPrimePrimeMatrix: MarshallerUtil_1.default.unmarshallMatrix(qPrimePrimeMatrix) }).then((result) => {
        res.status(200).json({ ok: true, message: 'Result Retrieval Completed' });
    });
});
exports.default = router;
