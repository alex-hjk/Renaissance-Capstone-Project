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
        const difficultyVoteInstance = typedi_1.Container.get(impl_1.DifficultyVoteService);
        if (api_1.queryIsDifficultyVoteRequest(req.body)) {
            const difficultyVoteRequest = req.body;
            const uid = req.user.uid;
            const difficultyVoteInput = { ...difficultyVoteRequest, uid };
            difficultyVoteInstance.AddVote(difficultyVoteInput).then(result => {
                res.status(200).json(result);
            }).catch(e => {
                if (e.message === 'duplicate key value violates unique constraint "difficulty_votes_pkey"') {
                    res.status(200).json({ ok: false, duplicated: true, error: 'User has voted before' });
                }
                res.status(500).json({ ok: false, error: e.message });
            });
        }
        else {
            res.status(400).json({ ok: false, error: 'bad request' });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
