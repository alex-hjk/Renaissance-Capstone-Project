"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const impl_1 = __importDefault(require("../../service/impl"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
router.get('/getTopicsBySid', (req, res) => {
    try {
        const filterServiceInstance = typedi_1.Container.get(impl_1.default);
        const filterInput = req.query;
        filterServiceInstance.GetTopicsBySubjectId(filterInput)
            .then((topics) => { res.status(200).json({ topics }); })
            .catch(e => {
            res.status(500).json({ error: e.message });
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message, status: 500 });
    }
});
router.get('/getCategoriesAndTagsBySid', (req, res) => {
    try {
        const filterServiceInstance = typedi_1.Container.get(impl_1.default);
        const filterInput = req.query;
        filterServiceInstance.GetCatogoriesAndTagsBySubjectId(filterInput)
            .then((categoriesAndTags) => { res.status(200).json(categoriesAndTags); })
            .catch(e => {
            res.status(500).json({ error: e.message });
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message, status: 500 });
    }
});
exports.default = router;
