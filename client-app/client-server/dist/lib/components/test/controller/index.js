"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const service_1 = __importDefault(require("../service"));
const router = express_1.default.Router();
router.get('/testRequest', async (req, res) => {
    const { testParam } = req.params;
    const testServiceInstance = typedi_1.Container.get(service_1.default);
    testServiceInstance.TestService({ testParam }).then(({ testResponse }) => {
        res.status(200).json({ status: 200, response: testResponse });
    }).catch(err => {
        res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 });
    });
});
exports.default = router;
