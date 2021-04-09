"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const impl_1 = __importDefault(require("../../service/impl"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
router.post('/signUp', async (req, res) => {
    let { email, name, googleAuthToken, password } = req.body;
    let googleId, profilePicUrl;
    const authServiceInstance = typedi_1.Container.get(impl_1.default);
    if (googleAuthToken) {
        const { name: _name, email: _email, googleId: _googleId, profilePicUrl: _profilePicUrl } = await authServiceInstance.VerifyGoogleToken({ googleAuthToken });
        name = _name;
        email = _email;
        googleId = _googleId;
        profilePicUrl = _profilePicUrl;
    }
    authServiceInstance.SignUp({ name, email, googleId, password, profilePicUrl }).then(({ user, token, error, subjectsRegistered }) => {
        if (error) {
            res.status(200).json({ error, status: 200 });
        }
        else {
            res.status(200).json({ user, accessToken: token, refreshToken: token, subjectsRegistered, status: 200 });
        }
    }).catch(err => {
        res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 });
    });
});
router.post('/signInWithEmail', async (req, res) => {
    let { email, password, googleAuthToken } = req.body;
    let googleId;
    const authServiceInstance = typedi_1.Container.get(impl_1.default);
    if (googleAuthToken) {
        const { email: _email, googleId: _googleId } = await authServiceInstance.VerifyGoogleToken({ googleAuthToken });
        email = _email;
        googleId = _googleId;
    }
    authServiceInstance.SignIn({ email, password, googleId }).then(({ token, subjectsRegistered, error }) => {
        if (error) {
            res.status(200).json({ error, status: 200 });
        }
        else {
            const signInResponse = { accessToken: token, refreshToken: token, subjectsRegistered, status: 200 };
            res.json(signInResponse);
        }
    }).catch(err => {
        res.status(500).json({ error: { type: 'general', message: err.message }, status: 500 });
    });
});
router.post('/signInWithGoogle', (req, res) => {
    res.status(200).json({ message: 'not implemented' });
});
router.get('/refreshToken', (req, res) => {
    const authServiceInstance = typedi_1.Container.get(impl_1.default);
    const refreshTokenInput = req.body;
    authServiceInstance.RefreshToken(refreshTokenInput).then(({ user, token, refreshToken }) => {
        const refreshTokenResponse = { accessToken: token, refreshToken, status: 200 };
        res.json(refreshTokenResponse);
    });
});
exports.default = router;
