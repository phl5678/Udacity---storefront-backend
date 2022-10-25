"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../models/user");
const server_1 = __importDefault(require("../../server"));
const auth_1 = require("../auth");
describe('Authenticatin Middleware Testing', () => {
    const request = (0, supertest_1.default)(server_1.default);
    describe('createAuthToken(): creates auth jwt token', () => {
        it('should return jwt token.', () => {
            const user = {
                id: 1,
                email: 'jwt@jwt.com',
                password_digest: '',
                role: user_1.UserRole.Customer,
            };
            const token = (0, auth_1.createAuthToken)(user);
            expect(token).not.toBeNull();
        });
    });
    describe('verifyAuthToken() middleware', () => {
        let admin;
        let user;
        let user2;
        beforeAll(async () => {
            admin = {
                email: 'admin@auth.com',
                password: 'admin1234',
                role: user_1.UserRole.Admin,
            };
            const resAdmin = await request
                .post('/users')
                .send(admin)
                .set('Accept', 'application/json');
            admin.id = resAdmin.body.id.toString();
            admin.token = resAdmin.body.token;
            user = {
                email: 'user@auth.com',
                password: 'user1234',
            };
            const resUser = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            user.id = resUser.body.id.toString();
            user.token = resUser.body.token;
            user2 = {
                email: 'cx@auth.com',
                password: 'cx1234',
            };
            const resUser2 = await request
                .post('/users')
                .send(user2)
                .set('Accept', 'application/json');
            user2.id = resUser2.body.id.toString();
            user2.token = resUser2.body.token;
        });
        it('should return 200 when admin tries to get any user.', async () => {
            const response = await request
                .get(`/users/${user.id}`)
                .auth(admin.token, { type: 'bearer' });
            expect(response.status).toEqual(200);
        });
        it('should return 200 when the user tries to get his own info.', async () => {
            const response = await request
                .get(`/users/${user.id}`)
                .auth(user.token, { type: 'bearer' });
            expect(response.status).toEqual(200);
        });
        it('should return 401 when a user tries to get other user info.', async () => {
            const response = await request
                .get(`/users/${user.id}`)
                .auth(user2.token, { type: 'bearer' });
            expect(response.status).toEqual(401);
        });
    });
});
