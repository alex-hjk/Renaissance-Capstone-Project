"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const impl_1 = require("../../service/impl");
const typedi_1 = require("typedi");
const fileUpload_1 = require("../../../../common/fileUpload");
const router = express_1.default.Router();
const queryIsGetQuestionInput = (query) => {
    if (query.sid && (query.answered === true || query.answered === false)) {
        return true;
    }
    else {
        return false;
    }
};
const queryIsGetQuestionAndAnswersInput = (query) => {
    if (query.qid) {
        return true;
    }
    else {
        return false;
    }
};
router.post('/addQuestion', fileUpload_1.upload.single('file'), (req, res) => {
    const user = req.user;
    try {
        if (user) {
            const fileUrl = (req.file && req.file.location) || '';
            const questionInput = {
                user,
                text: req.body.text,
                imageUrl: fileUrl,
                anonymous: req.body.anonymous,
                timestamp: req.body.timeStamp,
                sid: req.body.sid,
                tid: req.body.tid,
                tags: JSON.parse(req.body.tags)
            };
            const questionsRouteinstance = typedi_1.Container.get(impl_1.QuestionsService);
            questionsRouteinstance.AddQuestion(questionInput).then(({ qid }) => {
                const responseData = {
                    ok: true,
                    qid,
                    status: 200
                };
                res.status(200).json(responseData);
            }).catch(e => {
                res.status(500).json({ error: e.message, status: 500 });
            });
        }
        else {
            res.status(500).json({ error: 'Backend code error, this line should not be reached', status: 500 });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message, status: 500 });
    }
});
router.get('/getQuestionsByFilter', (req, res) => {
    const questionsRouteinstance = typedi_1.Container.get(impl_1.QuestionsService);
    const query = { ...req.query, answered: (req.query.answered === 'true') };
    if (queryIsGetQuestionInput(query)) {
        const { sid, answered, selectedTopics, selectedTags } = query;
        const filters = { sid, answered, selectedTopics, selectedTags };
        questionsRouteinstance.GetQuestions(filters).then(result => {
            res.json(result);
        }).catch(e => {
            res.json({ error: e.message });
        });
    }
    else {
        res.status(433).json({ error: 'bad request' });
    }
});
router.get('/getQuestionAndAnswersById', (req, res) => {
    const uid = req.user.uid;
    const questionsRouteinstance = typedi_1.Container.get(impl_1.QuestionsService);
    if (queryIsGetQuestionAndAnswersInput(req.query)) {
        const input = ({ ...req.query, uid });
        questionsRouteinstance.GetQuestionAndAnswerById(input).then(result => {
            res.status(200).json(result);
        }).catch(e => {
            res.status(500).json({ error: e.message });
        });
    }
    else {
        res.status(433).json({ error: 'bad request' });
    }
});
router.post('/deleteQuestion', (req, res) => {
    try {
        const questionsRouteinstance = typedi_1.Container.get(impl_1.QuestionsService);
        const { qid } = req.body;
        const uid = req.user.uid;
        const input = { qid, uid };
        questionsRouteinstance.DeleteQuestion(input).then(() => {
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
router.post('/upvoteQuestion', (req, res) => {
    try {
        const questionsRouteInstance = typedi_1.Container.get(impl_1.QuestionsService);
        const { qid } = req.body;
        const uid = req.user.uid;
        const input = { qid, uid };
        questionsRouteInstance.UpvoteQuestion(input).then(() => {
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
