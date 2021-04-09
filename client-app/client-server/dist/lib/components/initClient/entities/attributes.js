"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Attribute {
    constructor(name, number, field, getHash) {
        this.getHashedValue = () => {
            return this.field.prng(this.getHash({ name: this.name, number: this.number }));
        };
        this.name = name;
        this.number = number;
        this.field = field;
        this.getHash = getHash;
    }
}
exports.default = Attribute;
