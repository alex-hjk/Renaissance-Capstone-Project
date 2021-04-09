"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.verifyPassword = exports.hashPassword = exports.generateUUID = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const js_sha256_1 = require("js-sha256");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
dotenv_1.default.config();
const tokenExpirationTime = '10000s';
const generateUUID = () => {
    return uuid_1.v4();
};
exports.generateUUID = generateUUID;
const hashPassword = (password) => {
    const salt = crypto_1.randomBytes(32).toString('hex');
    return { hashedPassword: js_sha256_1.sha256(password + salt), salt };
};
exports.hashPassword = hashPassword;
const verifyPassword = (password, hashedPassword, salt) => {
    const newHash = js_sha256_1.sha256(password + salt);
    if (newHash === hashedPassword) {
        return true;
    }
    else {
        return false;
    }
};
exports.verifyPassword = verifyPassword;
const generateAccessToken = ({ uid, email, profilePicUrl }) => {
    const secret = process.env.JWT_TOKEN_SECRET || '';
    return jsonwebtoken_1.default.sign({ uid, email, profilePicUrl }, secret, { expiresIn: tokenExpirationTime });
};
exports.generateAccessToken = generateAccessToken;
