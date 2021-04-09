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
exports.default = MarshallerUtil;
