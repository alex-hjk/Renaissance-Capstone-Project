"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbAccess_1 = require("../../../common/dataAccess/dbAccess");
class AttributesRepo {
    constructor() {
        this.getLocalAttributes = async () => {
            const queryString = 'select * from client.attributes';
            const results = await dbAccess_1.query(queryString);
            return results.rows;
        };
    }
}
exports.default = AttributesRepo;
