"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Dashboard Endpoint Testing', () => {
    const request = (0, supertest_1.default)(server_1.default);
    describe('This gets all products that have been included in orders', () => {
        it('should return 200 when requesting /dashboard/products_in_orders', () => {
            request.get('/dashboard/products_in_orders').expect(200);
        });
    });
    describe('This gets top X expensive products', () => {
        it('should return 200 when requesting /dashboard/top_expensive_products', () => {
            request.get('/dashboard/top_expensive_products').expect(200);
        });
        it('should return 200 when requesting /dashboard/top_expensive_products?limit=3', () => {
            request.get('/dashboard/top_expensive_products?limit=3').expect(200);
        });
        it('should return 400 when requesting /dashboard/top_expensive_products?limit=abc', () => {
            request.get('/dashboard/top_expensive_products?limit=abc').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_expensive_products?limit=-3', () => {
            request.get('/dashboard/top_expensive_products?limit=-3').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_expensive_products?limit=3.2', () => {
            request.get('/dashboard/top_expensive_products?limit=3.2').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_expensive_products?limit=', () => {
            request.get('/dashboard/top_expensive_products?limit=').expect(400);
        });
    });
    describe('This gets top X popular products', () => {
        it('should return 200 when requesting /dashboard/top_popular_products', () => {
            request.get('/dashboard/top_popular_products').expect(200);
        });
        it('should return 200 when requesting /dashboard/top_popular_products?limit=3', () => {
            request.get('/dashboard/top_popular_products?limit=3').expect(200);
        });
        it('should return 400 when requesting /dashboard/top_popular_products?limit=abc', () => {
            request.get('/dashboard/top_popular_products?limit=abc').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_popular_products?limit=-3', () => {
            request.get('/dashboard/top_popular_products?limit=-3').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_popular_products?limit=3.2', () => {
            request.get('/dashboard/top_popular_products?limit=3.2').expect(400);
        });
        it('should return 400 when requesting /dashboard/top_popular_products?limit=', () => {
            request.get('/dashboard/top_popular_products?limit=').expect(400);
        });
    });
    describe('This gets all users that have placed orders', () => {
        it('should return 200 when requesting /dashboard/users_with_orders', () => {
            request.get('/dashboard/users_with_orders').expect(200);
        });
    });
});
