"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = __importDefault(require("pg"));
const database_1 = require("./database");
const Pool = pg_1.default.Pool;
const pool = new Pool({
    user: database_1.user,
    password: database_1.password,
    database: database_1.database,
    host: database_1.host,
    port: database_1.port
});
const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};
exports.query = query;
