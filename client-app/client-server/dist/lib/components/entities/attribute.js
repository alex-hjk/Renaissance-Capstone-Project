"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Attribute {
    constructor(name, number, { hashedValue, field, getHash }) {
        this.getHashedValue = () => {
            if (!this.hashedValue && this.field && this.getHash) {
                return this.field.prng(this.getHash({ name: this.name, number: this.number }));
            }
            else if (this.hashedValue) {
                return this.hashedValue;
            }
            else {
                throw new Error('Problem with getting hashed value, check attributes entity');
            }
        };
        this.name = name;
        this.number = number;
        this.field = field;
        this.getHash = getHash;
        this.hashedValue = BigInt(hashedValue);
    }
}
exports.default = Attribute;
