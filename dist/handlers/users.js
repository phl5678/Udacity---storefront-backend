"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var user_1 = require("../models/user");
var auth_1 = require("../middlewares/auth");
var store = new user_1.UserStore();
/**
 * This gets all users.
 * @param _req http request. (unused)
 * @param res http response. send a list of users in json format.
 */
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.index()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400);
                res.json(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This gets a user by giving user id.
 * @param req http request. req.params.id is expected.
 * @param res http response. send requested user record in json format.
 */
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (req.params.uid === undefined || req.params.uid === '') {
                    throw new Error('user id is required.');
                }
                return [4 /*yield*/, store.show(parseInt(req.params.uid))];
            case 1:
                user = _a.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400);
                res.json(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This creates a new user record if no existing email found, and creates authentication token.
 * @param req http request. expecting post body data for user info - email (required), password (required), first name, last name, and role. The role defaults to customer if not set.
 * @param res http response. send the signed token, user id, and email.
 */
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkEmail, user, result, token, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (req.body.email === undefined || req.body.email === '')
                    throw new Error('email is required.');
                if (req.body.password === undefined || req.body.password === '')
                    throw new Error('password is required.');
                return [4 /*yield*/, store.authenticate(req.body.email, req.body.password)];
            case 1:
                checkEmail = _a.sent();
                if (checkEmail !== null)
                    throw new Error('Email exists. Please log in.');
                user = {
                    email: req.body.email,
                    password_digest: req.body.password,
                    first_name: req.body.first_name === undefined ? '' : req.body.first_name,
                    last_name: req.body.last_name === undefined ? '' : req.body.last_name,
                    role: req.body.role === undefined || req.body.role === ''
                        ? user_1.UserRole.Customer
                        : req.body.role
                };
                return [4 /*yield*/, store.create(user)];
            case 2:
                result = _a.sent();
                token = (0, auth_1.createAuthToken)(result);
                res.json({ token: token, id: result.id, email: result.email });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400);
                res.json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * This verifies the given user's credential. if pass, return the auth token.
 * @param req http request. required user email and plain password.
 * @param res http response. send the authentication token, user id and email.
 */
var authenticate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var u, result, token, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (req.body.email === undefined || req.body.email === '')
                    throw new Error('email is required.');
                if (req.body.password === undefined || req.body.password === '')
                    throw new Error('password is required.');
                u = {
                    email: req.body.email,
                    password_digest: req.body.password
                };
                return [4 /*yield*/, store.authenticate(u.email, u.password_digest)];
            case 1:
                result = _a.sent();
                if (result === null) {
                    throw new Error('Email not found.');
                }
                if (result.isAuth === false) {
                    throw new Error('Authentication failed. Password not matched.');
                }
                token = (0, auth_1.createAuthToken)(result.user);
                if (token === undefined || token.length === 0) {
                    throw new Error('createAuthToken failed.');
                }
                res.json({ token: token, id: result.user.id, email: result.user.email });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(400);
                res.json(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This defines the routes for users entity.
 * @param app express Application
 */
var userRoutes = function (app) {
    app.post('/users', create);
    app.get('/users', auth_1.verifyAuthToken, index);
    app.get('/users/:uid', auth_1.verifyAuthToken, show);
    app.post('/users/authenticate', authenticate);
};
exports["default"] = userRoutes;
