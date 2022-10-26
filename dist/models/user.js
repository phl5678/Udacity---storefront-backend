"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = exports.UserRole = void 0;
const database_1 = __importStar(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["Customer"] = "customer";
    UserRole["Staff"] = "staff";
})(UserRole || (UserRole = {}));
exports.UserRole = UserRole;
/**
 * User CRUD operation class
 */
class UserStore {
    /**
     * This gets all users asynchronously.
     * @returns a promist with array of user objects.
     */
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }
    /**
     * This gets one user asynchronously.
     * @param id User Id.
     * @returns a promise with user object.
     */
    async show(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error(`No such user ${id} exists.`);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get user ${id}. Error: ${err}`);
        }
    }
    /**
     * This creates a new user.
     * @param user User object, email and password are required.
     * @returns a promise with newly created user object.
     */
    async create(user) {
        try {
            if (user.email === '' || user.password_digest === '')
                throw new Error('Email and password are required.');
            if (user.role === undefined)
                user.role = UserRole.Customer;
            const sql = 'INSERT INTO users (password_digest, email, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(user.password_digest + database_1.BCRYPT_PASSWORD, database_1.SALT_ROUNDS);
            const result = await conn.query(sql, [
                hash,
                user.email,
                user.first_name,
                user.last_name,
                user.role,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add user ${user.email}. Error: ${err}`);
        }
    }
    /**
     * This autheticates a user, will check the email existence before authentication.
     * @param email the email of the user to be authenticated
     * @param password the plain password of the user to be authenticated.
     * @returns a promise with a custom object {isAuth: true, user: User} if passwords matched,
     * {isAuth: false, user: User} if passwords not matched, or Null if email not found
     */
    async authenticate(email, password) {
        try {
            if (email === '' || password === '')
                throw new Error('Email and password are required.');
            const conn = await database_1.default.connect();
            const sql = 'SELECT id, email, password_digest, role FROM users WHERE email = ($1)';
            const result = await conn.query(sql, [email]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            const user = result.rows[0];
            return bcrypt_1.default.compareSync(password + database_1.BCRYPT_PASSWORD, user.password_digest)
                ? { isAuth: true, user: user }
                : { isAuth: false, user: user };
        }
        catch (err) {
            throw new Error(`Email ${email} not found.`);
        }
    }
}
exports.UserStore = UserStore;
