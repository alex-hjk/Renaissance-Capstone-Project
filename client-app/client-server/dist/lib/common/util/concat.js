"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHashValue = exports.concatenateAttribute = void 0;
const concatenateAttribute = (attribute, smallField, fieldSize) => {
    const hashValue = String(smallField.prng(attribute));
    let pad = '';
    for (let i = 0; i < String(fieldSize).length - hashValue.length; i++) {
        pad += '0';
    }
    return BigInt(hashValue + pad + String(attribute));
};
exports.concatenateAttribute = concatenateAttribute;
const checkHashValue = (answer, smallField, num) => {
    const hash = String(answer).slice(0, String(num).length);
    const value = String(answer).slice(String(num).length);
    const hashValue = String(smallField.prng(BigInt(value)));
    let pad = '';
    for (let i = 0; i < String(num).length - hashValue.length; i++) {
        pad += '0';
    }
    if (hash !== undefined && BigInt(hash) === BigInt(hashValue + pad)) {
        return { value, realValue: true };
    }
    else {
        return { value, realValue: false };
    }
};
exports.checkHashValue = checkHashValue;
