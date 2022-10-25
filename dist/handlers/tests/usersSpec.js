"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../models/user");
const server_1 = __importDefault(require("../../server"));
describe('Users Endpoint Testing', () => {
    const request = (0, supertest_1.default)(server_1.default);
    describe('This create a new admin user', () => {
        it('should return 200, json content type and token to be defined in body when posting /users', async () => {
            const user = {
                email: 'admin@users.com',
                password: 'admin1234',
                first_name: 'Admin',
                last_name: 'Nimda',
                role: user_1.UserRole.Admin,
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.token).toBeDefined();
        });
    });
    describe('This create a new customer', () => {
        it('should return 200, json content type and token to be defined in body when posting /users', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
                first_name: 'User',
                last_name: 'Resu',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.token).toBeDefined();
        });
        it('should return 400 when posting /users with empty email', async () => {
            const user = {
                email: '',
                password: 'user1234',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
        it('should return 400 when posting /users without email field', async () => {
            const user = {
                password: 'user1234',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
        it('should return 400 when posting /users using existing email', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
        it('should return 400 when posting /users with empty password', async () => {
            const user = {
                email: 'user@users.com',
                password: '',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
        it('should return 400 when posting /users without password field', async () => {
            const user = {
                email: 'user@users.com',
            };
            const response = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
    });
    describe('This authenticates a user', () => {
        it('should return 200 and body.token is defined when requesting /users/authenticate with admin info', async () => {
            const user = {
                email: 'admin@users.com',
                password: 'admin1234',
            };
            const response = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(response.body.token).toBeDefined();
        });
        it('should return 400 when requesting /users/authenticate with admin email and a bad password', async () => {
            const user = {
                email: 'admin@users.com',
                password: 'badpassword',
            };
            const response = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
        it('should return 400 when requesting /users/authenticate with non-existing email', async () => {
            const user = {
                email: 'ghost@users.com',
                password: 'badpassword',
            };
            const response = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(400);
        });
    });
    describe('This gets all users', () => {
        it('should return 200 and more than 2 users when requesting /users with admin token', async () => {
            const user = {
                email: 'admin@users.com',
                password: 'admin1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const response = await request
                .get('/users')
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(200);
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });
        it('should return 401 when requesting /users without token', async () => {
            const response = await request.get('/users');
            expect(response.status).toEqual(401);
        });
        it('should return 401 when requesting /users with customer token', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const response = await request
                .get('/users')
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(401);
        });
    });
    describe('This gets one user', () => {
        it('should return 200 and body.id=2 when admin requesting /users/2 with admin token', async () => {
            const user = {
                email: 'admin@users.com',
                password: 'admin1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const response = await request
                .get('/users/2')
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(200);
            expect(response.body.id).toEqual(2);
        });
        it('should return 200 and matched body.id when customer requesting his own info /users/:id with his own token', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const id = res.body.id;
            const response = await request
                .get(`/users/${id}`)
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(200);
            expect(response.body.id).toEqual(id);
        });
        it('should return 401 when customer requesting other user info /users/1 with customer token', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const response = await request
                .get('/users/1')
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(401);
        });
        it('should return 400 when requesting non-existing /users/5 with admin token', async () => {
            const user = {
                email: 'user@users.com',
                password: 'user1234',
            };
            const res = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const token = res.body.token;
            const response = await request
                .get('/users/1')
                .auth(token, { type: 'bearer' });
            expect(response.status).toEqual(401);
        });
    });
});
