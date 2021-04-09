"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MarshallerUtil {
}
MarshallerUtil.marshallObject = (object) => {
    const stringified = JSON.stringify(object, (key, value) => typeof value === 'bigint'
        ? value.toString()
        : value);
    return stringified;
};
MarshallerUtil.unmarshallMatrix = (object) => {
    const matrix = JSON.parse(object).map((elementArr) => elementArr.map((value) => BigInt(value)));
    return matrix;
};
exports.default = MarshallerUtil;
