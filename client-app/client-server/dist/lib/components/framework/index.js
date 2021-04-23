"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppState_1 = __importDefault(require("../communicators/AppState/AppState"));
const controller_1 = __importDefault(require("../../application/controller"));
const service_1 = __importDefault(require("../../application/service"));
const memDB_1 = __importDefault(require("../../application/db/memDB"));
const memDA_1 = __importDefault(require("../../application/dataAccess/memDA"));
const CloudCommunicator_1 = __importDefault(require("../communicators/CloudCommunicator"));
const typedi_1 = require("typedi");
const MarshallerUtil_1 = __importDefault(require("../communicators/Util/MarshallerUtil"));
const CloudUrlCache_1 = __importDefault(require("../communicators/Cache/CloudUrlCache"));
const TestDataUtil_1 = __importDefault(require("./TestDataUtil"));
const router = express_1.default.Router();
const initServices = () => {
    const appState = typedi_1.Container.get(AppState_1.default);
    const cloudUrlCache = typedi_1.Container.get(CloudUrlCache_1.default);
    const clientDBInstance = typedi_1.Container.get(memDB_1.default);
    const cloudCommunicator = new CloudCommunicator_1.default(cloudUrlCache);
    const clientDA = new memDA_1.default(clientDBInstance);
    const client = new service_1.default(cloudCommunicator, clientDA, appState);
    const clientController = new controller_1.default(client);
    return clientController;
};
const setCloudUrl = (cloudUrl) => {
    const cloudUrlCache = typedi_1.Container.get(CloudUrlCache_1.default);
    cloudUrlCache.setCloudUrl(cloudUrl);
};
router.post('/initClient', async (req, res) => {
    try {
        const { masterKey, clientID, cloudUrl, testSize, clientUrl } = req.body;
        let { attributes } = req.body;
        if (testSize) {
            attributes = TestDataUtil_1.default(testSize);
        }
        setCloudUrl(cloudUrl);
        const clientController = initServices();
        const clientIP = clientUrl;
        clientController.initClient({ masterKey, attributes, clientID, clientIP }).then((result) => {
            res.status(200).json({ ok: true, message: 'client initiated', blindedVectors: MarshallerUtil_1.default.marshallObject(result) });
        }).catch(e => {
            res.status(500).json({ ok: false, message: e.message });
        });
    }
    catch (e) {
        res.status(200).json({ ok: false, message: e.message });
    }
});
router.post('/initPSI', async (req, res) => {
    try {
        const clientController = initServices();
        const { requesteeID } = req.body;
        clientController.initPSI({ requesteeID }).then((result) => {
            res.status(200).json({ ok: true, message: 'PSI Initiated' });
        });
    }
    catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
});
router.post('/computationDelegation', async (req, res) => {
    try {
        const clientController = initServices();
        const { requesterID } = req.body;
        clientController.computationDelegation({ requesterID }).then((result) => {
            res.status(200).json({ ok: true, message: 'Computation Delegation Initiated' });
        });
    }
    catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
});
router.post('/resultsRetrieval', async (req, res) => {
    try {
        const clientController = initServices();
        const { qPrimeMatrix, qPrimePrimeMatrix } = req.body;
        const request = { qPrimeMatrix: MarshallerUtil_1.default.unmarshallMatrix(qPrimeMatrix), qPrimePrimeMatrix: MarshallerUtil_1.default.unmarshallMatrix(qPrimePrimeMatrix) };
        clientController.resultsRetrieval(request).then((result) => {
            res.status(200).json({ ok: true, message: 'Result Retrieval Completed' });
        });
    }
    catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
});
router.get('/getIntersectionResult', async (req, res) => {
    try {
        const clientController = initServices();
        const intersectionResult = clientController.getIntersectionResult();
        const status = intersectionResult === 'isPending' ? 'pending' : 'completed or error occured';
        const result = (intersectionResult && intersectionResult !== 'isPending') ? intersectionResult : undefined;
        if (result && result.resultsRetrievalReq) {
            result.resultsRetrievalReq.qPrimeMatrix = MarshallerUtil_1.default.marshallObject(result.resultsRetrievalReq.qPrimeMatrix);
            result.resultsRetrievalReq.qPrimePrimeMatrix = MarshallerUtil_1.default.marshallObject(result.resultsRetrievalReq.qPrimePrimeMatrix);
        }
        res.status(200).json({ status, ...result });
    }
    catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
});
router.get('/getAttributes', async (req, res) => {
    try {
        const clientController = initServices();
        const attributes = clientController.getAttributes();
        res.status(200).json({ attributes });
    }
    catch (e) {
        res.status(200).json({ ok: false, message: e.message });
    }
});
exports.default = router;
