"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHash = void 0;
const sha1_1 = __importDefault(require("crypto-js/sha1"));
const getHash = ({ name, number }) => {
    const hash = BigInt(('0x' + sha1_1.default(name + number.toString())));
    return hash;
};
exports.getHash = getHash;
