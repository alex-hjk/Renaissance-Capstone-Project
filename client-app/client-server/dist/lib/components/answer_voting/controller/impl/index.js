"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const impl_1 = require("../../service/impl");
const typedi_1 = require("typedi");
const api_1 = require("../api");
const router = express_1.default.Router();
router.post('/addVote', (req, res) => {
    try {
        if (api_1.queryIsAnswerVoteRequest(req.body)) {
            const { aid, vote } = req.body;
            const uid = req.user.uid;
            const answerVoteInput = { aid, vote, uid };
            const answerVoteServiceInstance = typedi_1.Container.get(impl_1.AnswerVoteService);
            answerVoteServiceInstance.AddVote(answerVoteInput).then((result) => {
                res.status(200).json({ ok: true, status: 200 });
            }).catch(e => {
                res.status(500).json({ ok: false, error: e.message });
            });
        }
        else {
            res.status(433).json({ error: 'Bad Request' });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
