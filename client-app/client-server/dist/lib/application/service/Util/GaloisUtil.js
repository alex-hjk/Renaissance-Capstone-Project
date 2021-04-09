"use strict";
const galois = require("@guildofweavers/galois");
class GaloisUtil {
}
GaloisUtil.generateGaloisFields = (primeNumbers) => {
    return primeNumbers.map((primeNumber) => galois.createPrimeField(primeNumber));
};
module.exports = GaloisUtil;
