"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbAccess_1 = require("../../../common/dataAccess/dbAccess");
class ConfigRepo {
    async getClientID() {
        const queryString = 'select * from client.config';
        const result = await dbAccess_1.query(queryString);
        let name = '';
        result.rows.forEach(({ key, value }) => {
            if (key === 'clientid') {
                name = value;
            }
        });
        return name;
    }
    async getClientPassword() {
        const queryString = 'select * from client.config';
        const result = await dbAccess_1.query(queryString);
        let password = '';
        result.rows.forEach(({ key, value }) => {
            if (key === 'name') {
                password = value;
            }
        });
        return password;
    }
}
exports.default = ConfigRepo;
