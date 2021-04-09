"use strict";
const sha1 = require('crypto-js/sha1');
class HashUtil {
}
HashUtil.hashNameAndNumber = ({ name, number }) => {
    return BigInt(('0x' + sha1(name + number.toString())));
};
HashUtil.attributesToHash = (attributesArr) => {
    return attributesArr.map(({ name, number }) => HashUtil.hashNameAndNumber({ name, number }));
};
HashUtil.hashToNameAndNumber = (attributesArr, resultArr) => {
    const finalResult = [];
    attributesArr.forEach(({ name, number }) => {
        const hash = HashUtil.hashNameAndNumber({ name, number });
        if (resultArr.includes(hash.toString())) {
            finalResult.push({ name, number });
        }
    });
    return finalResult;
};
module.exports = HashUtil;
