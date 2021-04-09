"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./middlewares/logger"));
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const cors_1 = require("./middlewares/cors");
const router = express_1.default.Router();
router.use(logger_1.default);
router.use(express_1.default.json({ limit: '50mb' }));
router.use(cors_1.corsImpl);
router.use('/psi', controller_1.default);
exports.default = router;
