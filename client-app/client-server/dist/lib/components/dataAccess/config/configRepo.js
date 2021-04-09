"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbAccess_1 = require("../../../common/dataAccess/dbAccess");
const Error_1 = require("../../../common/Error");
class ConfigRepo {
    async getMasterKey() {
        try {
            const queryString = 'select value from client.config where key = \'masterkey\'';
            const result = await dbAccess_1.query(queryString);
            return result.rows[0].value;
        }
        catch (e) {
            throw new Error_1.DatabaseError(e.message);
        }
    }
    async saveMasterKey(mk) {
        try {
            const queryString = 'insert into client.config (key, value) values ($1, $2) on conflict do nothing';
            await dbAccess_1.query(queryString, ['masterkey', mk]);
        }
        catch (e) {
            throw new Error_1.DatabaseError(e.message);
        }
    }
    async saveClientID(clientID) {
        try {
            const queryString = 'insert into client.config (key, value) values ($1, $2) on conflict do nothing';
            await dbAccess_1.query(queryString, ['clientID', clientID]);
        }
        catch (e) {
            throw new Error_1.DatabaseError(e.message);
        }
    }
    async getClientID() {
        try {
            const queryString = 'select value from client.config where key = \'clientID\'';
            const result = await dbAccess_1.query(queryString);
            return result.rows[0].value;
        }
        catch (e) {
            throw new Error_1.DatabaseError(e.message);
        }
    }
}
exports.default = ConfigRepo;
