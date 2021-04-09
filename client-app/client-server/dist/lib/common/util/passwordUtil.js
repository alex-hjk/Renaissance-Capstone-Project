"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordToMk = void 0;
const crypto_js_1 = require("crypto-js");
const passwordToMk = (password, field) => {
    const hash = BigInt(`0x${crypto_js_1.SHA1(password)}`);
    const mk = field.prng(hash).toString();
    return mk;
};
exports.passwordToMk = passwordToMk;
