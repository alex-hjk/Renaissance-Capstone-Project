"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const impl_1 = __importDefault(require("../../service/impl"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
const queryIsGetProfileRequest = (query) => {
    if (query.uid) {
        return true;
    }
    else {
        return false;
    }
};
const bodyIsRegisterSubjectsRequest = (body) => {
    if (body.sid) {
        return true;
    }
    else {
        return false;
    }
};
router.get('/getProfileById', (req, res) => {
    const user = req.user;
    const profileServiceInstance = typedi_1.Container.get(impl_1.default);
    try {
        if (user && queryIsGetProfileRequest(req.query)) {
            if (user.uid === req.query.uid) {
                profileServiceInstance.GetPrivateProfile(req.query).then((response) => {
                    res.status(200).json({ response });
                }).catch(e => {
                    res.status(500).json({ error: e.message });
                });
            }
            else {
                profileServiceInstance.GetPublicProfile(req.query).then((response) => {
                    res.status(200).json({ response });
                }).catch(e => {
                    res.status(500).json({ error: e.message });
                });
            }
        }
        else {
            res.status(433).json({ error: 'bad request' });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get('/getAllSubjects', (req, res) => {
    const profileServiceInstance = typedi_1.Container.get(impl_1.default);
    profileServiceInstance.GetAllSubjects()
        .then((response) => {
        res.status(200).json(response);
    })
        .catch((e) => {
        res.status(500).json({ error: e.message });
    });
});
router.post('/updateProfile', (req, res) => {
    const uid = req.user.uid;
    const profileServiceInstance = typedi_1.Container.get(impl_1.default);
    try {
        if (uid) {
            profileServiceInstance.UpdateProfile({ ...req.body, uid }).then(() => {
                res.status(200).json({ ok: true, status: 200 });
            }).catch(e => {
                res.status(500).json({ error: e.message });
            });
        }
        else {
            res.status(433).json({ error: 'bad or unauthorized request' });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post('/registerSubject', (req, res) => {
    const user = req.user;
    const profileServiceInstance = typedi_1.Container.get(impl_1.default);
    try {
        if (user && bodyIsRegisterSubjectsRequest(req.body)) {
            profileServiceInstance.RegisterSubject({ sid: req.body.sid, uid: user.uid }).then(({ errorType, ok, error }) => {
                if (!error) {
                    res.status(200).json({ ok: true, status: 200 });
                }
                else {
                    res.status(200).json({ ok: false, error, errorType });
                }
            }).catch(e => {
                res.status(500).json({ error: e.message });
            });
        }
        else {
            res.status(433).json({ error: 'bad or unauthorized request' });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
