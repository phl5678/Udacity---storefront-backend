"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../models/user");
const server_1 = __importDefault(require("../../server"));
describe('Products Endpoint Testing', () => {
    const request = (0, supertest_1.default)(server_1.default);
    let adminToken = '';
    let userToken = '';
    beforeAll(async () => {
        const admin = {
            email: 'admin@products.com',
            password: 'admin1234',
            role: user_1.UserRole.Admin,
        };
        const resAdmin = await request
            .post('/users')
            .send(admin)
            .set('Accept', 'application/json');
        adminToken = resAdmin.body.token;
        const user = {
            email: 'user@products.com',
            password: 'user1234',
        };
        const resUser = await request
            .post('/users')
            .send(user)
            .set('Accept', 'application/json');
        userToken = resUser.body.token;
    });
    describe('This create a new product (id=1)', () => {
        it('should return 200, json content type and id not null when posting /products with Admin token', async () => {
            const product = {
                name: 'Chamomile Herbal Teas 20 Teabags',
                price: '18',
                category: 'herbal',
            };
            const response = await request
                .post('/products')
                .send(product)
                .auth(adminToken, { type: 'bearer' })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.id).not.toBeNull();
        });
        it('should return 401 when posting /products without token', async () => {
            const product = {
                name: 'Chamomile Herbal Teas 20 Teabags',
                price: '18',
                category: 'herbal',
            };
            const response = await request
                .post('/products')
                .send(product)
                .set('Accept', 'application/json');
            expect(response.status).toEqual(401);
        });
        it('should return 401 when posting /products with customer token', async () => {
            const product = {
                name: 'Chamomile Herbal Teas 20 Teabags',
                price: '18',
                category: 'herbal',
            };
            const response = await request
                .post('/products')
                .send(product)
                .auth(userToken, { type: 'bearer' })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(401);
        });
    });
    describe('This create multiple new products at once', () => {
        it('should return 200, json content type and body.length to 5 when posting /products/multiple with Admin token', async () => {
            const products = [];
            products.push({
                name: 'Ceylon Black Tea 30 Envelopes',
                price: '30',
                category: 'black',
            });
            products.push({
                name: 'Sun Moon Lake Black Tea 15 Envelopes',
                price: '20',
                category: 'black',
            });
            products.push({
                name: 'Matcha Green Tea 20 Sticks',
                price: '18',
                category: 'green',
            });
            products.push({
                name: 'Calm & Relax Herbal Tea Collection 40 Teabags',
                price: '36',
                category: 'wellness',
            });
            products.push({
                name: 'Immunity Booster Wellness Tea Collection 40 Teabags',
                price: '35',
                category: 'wellness',
            });
            products.push({
                name: 'Sippingly Healthy Gut Wellness Teas 40 Teabags',
                price: '32',
                category: 'wellness',
            });
            const response = await request
                .post('/products/multiple')
                .send({ products: products })
                .auth(adminToken, { type: 'bearer' })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.length).toEqual(6);
        });
    });
    describe('This gets all products', () => {
        it('should return 200, json content type and array type body when getting /products', async () => {
            const response = await request.get('/products');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(7);
        });
    });
    describe('This gets all products in certain catogory', () => {
        it('should return 200, json content type and array type body when getting /products?category=wellness', async () => {
            const response = await request.get('/products?category=wellness');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(3);
        });
        it('should return 400 when category value is empty /products?category=', async () => {
            const response = await request.get('/products?category=');
            expect(response.status).toEqual(400);
        });
        it('should return 200 and empty array when category value does not exist /products?category=whatever123', async () => {
            const response = await request.get('/products?category=whatever123');
            expect(response.status).toEqual(200);
            expect(response.body.length).toEqual(0);
        });
    });
    describe('This gets one product', () => {
        it('should return 200, json content type and body.id is 1 when getting /products/1', async () => {
            const response = await request.get('/products/1');
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toMatch(/json/);
            expect(response.body.id).toEqual(1);
        });
        it('should return 400 when getting non-existing product /products/200', async () => {
            const response = await request.get('/products/20');
            expect(response.status).toEqual(400);
        });
    });
});
