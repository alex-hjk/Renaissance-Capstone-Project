"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const impl_1 = __importDefault(require("../../service/impl"));
const fileUpload_1 = require("../../../../common/fileUpload");
const router = express_1.default.Router();
router.post('/addAnswer', fileUpload_1.upload.single('file'), (req, res) => {
    try {
        const uid = req.user.uid;
        const imageUrl = (req.file && req.file.location) || '';
        const answerInstance = typedi_1.Container.get(impl_1.default);
        const addAnswerInput = {
            answerer_id: uid,
            total_vote_weight: 0,
            answer_score: 0,
            anonymous: req.body.anonymous,
            qid: req.body.qid,
            text: req.body.text,
            timestamp: req.body.timestamp,
            image_url: imageUrl
        };
        answerInstance.AddAnswer(addAnswerInput).then(() => {
            res.json({ ok: true, status: 200 });
        }).catch(e => {
            res.status(500).json({ status: 500, error: e.message });
        });
    }
    catch (e) {
        res.status(500).json({ status: 500, error: e.message });
    }
});
router.post('/deleteAnswer', (req, res) => {
    try {
        const user = req.user;
        const questionsRouteinstance = typedi_1.Container.get(impl_1.default);
        const { aid } = req.body;
        const input = { aid, uid: user.uid };
        questionsRouteinstance.DeleteAnswer(input).then(() => {
            const responseData = {
                ok: true,
                status: 200
            };
            res.status(200).json(responseData);
        }).catch(e => res.status(500).json({ error: e.message, status: 500 }));
    }
    catch (e) {
        res.status(500).json({ error: e.message, status: 500 });
    }
});
exports.default = router;
