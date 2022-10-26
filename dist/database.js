"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_SECRET = exports.SALT_ROUNDS = exports.BCRYPT_PASSWORD = exports.default = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD, BCRYPT_PASSWORD, } = process.env;
exports.BCRYPT_PASSWORD = BCRYPT_PASSWORD;
const ENV = process.env.ENV === undefined ? 'dev' : process.env.ENV.trim(); //Windows "set ENV=test " has a trailing space.
const SALT_ROUNDS = process.env.SALT_ROUNDS === undefined
    ? 10
    : parseInt(process.env.SALT_ROUNDS);
exports.SALT_ROUNDS = SALT_ROUNDS;
const TOKEN_SECRET = process.env.TOKEN_SECRET === undefined ? '' : process.env.TOKEN_SECRET;
exports.TOKEN_SECRET = TOKEN_SECRET;
const Client = ENV === 'test'
    ? new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
    : new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
exports.default = Client;
