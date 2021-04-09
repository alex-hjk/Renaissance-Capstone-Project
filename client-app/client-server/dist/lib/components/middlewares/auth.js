"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function isUserI(obj) {
    return typeof obj.uid === 'string' && typeof obj.email === 'string';
}
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            const error = {
                name: 'wrongAuthHeader',
                message: 'No Authorisation header found'
            };
            throw error;
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET || '', (err, user) => {
            if (err) {
                const e = {
                    name: 'wrongAuthHeader',
                    message: err.message
                };
                throw e;
            }
            if (isUserI(user)) {
                req.user = user;
                next();
            }
            else {
                const error = {
                    name: 'jwtError',
                    message: 'Issue with JWT token deserialization'
                };
                throw error;
            }
        });
    }
    catch (e) {
        switch (e.name) {
            case 'emptyAuthHeader' || 'wrongAuthHeader' || 'jwtError':
                res.status(401).json({
                    ok: false,
                    status: 401,
                    error: e.message
                });
                break;
            default:
                res.status(500).json({
                    ok: false,
                    status: 500,
                    error: e.message
                });
        }
    }
};
exports.authenticateToken = authenticateToken;
