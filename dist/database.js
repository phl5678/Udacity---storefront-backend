"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.TOKEN_SECRET = exports.SALT_ROUNDS = exports.BCRYPT_PASSWORD = exports["default"] = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_TEST_DB = _a.POSTGRES_TEST_DB, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, BCRYPT_PASSWORD = _a.BCRYPT_PASSWORD;
exports.BCRYPT_PASSWORD = BCRYPT_PASSWORD;
var ENV = process.env.ENV === undefined ? 'dev' : process.env.ENV.trim(); //Windows "set ENV=test " has a trailing space.
var SALT_ROUNDS = process.env.SALT_ROUNDS === undefined
    ? 10
    : parseInt(process.env.SALT_ROUNDS);
exports.SALT_ROUNDS = SALT_ROUNDS;
var TOKEN_SECRET = process.env.TOKEN_SECRET === undefined ? '' : process.env.TOKEN_SECRET;
exports.TOKEN_SECRET = TOKEN_SECRET;
var Client = ENV === 'test'
    ? new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    })
    : new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
exports["default"] = Client;
