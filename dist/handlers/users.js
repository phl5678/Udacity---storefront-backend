"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const auth_1 = require("../middlewares/auth");
const store = new user_1.UserStore();
/**
 * This gets all users.
 * @param _req http request. (unused)
 * @param res http response. send a list of users in json format.
 */
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This gets a user by giving user id.
 * @param req http request. req.params.id is expected.
 * @param res http response. send requested user record in json format.
 */
const show = async (req, res) => {
    try {
        if (req.params.uid === undefined || req.params.uid === '') {
            throw new Error('user id is required.');
        }
        const user = await store.show(parseInt(req.params.uid));
        res.json(user);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This creates a new user record if no existing email found, and creates authentication token.
 * @param req http request. expecting post body data for user info - email (required), password (required), first name, last name, and role. The role defaults to customer if not set.
 * @param res http response. send the signed token, user id, and email.
 */
const create = async (req, res) => {
    try {
        if (req.body.email === undefined || req.body.email === '')
            throw new Error('email is required.');
        if (req.body.password === undefined || req.body.password === '')
            throw new Error('password is required.');
        const checkEmail = await store.authenticate(req.body.email, req.body.password);
        if (checkEmail !== null)
            throw new Error('Email exists. Please log in.');
        const user = {
            email: req.body.email,
            password_digest: req.body.password,
            first_name: req.body.first_name === undefined ? '' : req.body.first_name,
            last_name: req.body.last_name === undefined ? '' : req.body.last_name,
            role: req.body.role === undefined || req.body.role === ''
                ? user_1.UserRole.Customer
                : req.body.role,
        };
        const result = await store.create(user);
        const token = (0, auth_1.createAuthToken)(result);
        res.json({ token: token, id: result.id, email: result.email });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This verifies the given user's credential. if pass, return the auth token.
 * @param req http request. required user email and plain password.
 * @param res http response. send the authentication token, user id and email.
 */
const authenticate = async (req, res) => {
    try {
        if (req.body.email === undefined || req.body.email === '')
            throw new Error('email is required.');
        if (req.body.password === undefined || req.body.password === '')
            throw new Error('password is required.');
        const u = {
            email: req.body.email,
            password_digest: req.body.password,
        };
        const result = await store.authenticate(u.email, u.password_digest);
        if (result === null) {
            throw new Error('Email not found.');
        }
        if (result.isAuth === false) {
            throw new Error('Authentication failed. Password not matched.');
        }
        const token = (0, auth_1.createAuthToken)(result.user);
        if (token === undefined || token.length === 0) {
            throw new Error('createAuthToken failed.');
        }
        res.json({ token: token, id: result.user.id, email: result.user.email });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This defines the routes for users entity.
 * @param app express Application
 */
const userRoutes = (app) => {
    app.post('/users', create);
    app.get('/users', auth_1.verifyAuthToken, index);
    app.get('/users/:uid', auth_1.verifyAuthToken, show);
    app.post('/users/authenticate', authenticate);
};
exports.default = userRoutes;
