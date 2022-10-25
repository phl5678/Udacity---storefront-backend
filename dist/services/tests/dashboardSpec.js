"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../models/order");
const product_1 = require("../../models/product");
const user_1 = require("../../models/user");
const dashboard_1 = __importDefault(require("../dashboard"));
describe('Dashboard Services Testing', () => {
    const dash = new dashboard_1.default();
    beforeAll(async () => {
        const productStore = new product_1.ProductStore();
        const resProducts = await productStore.index();
        if (resProducts.length < 5) {
            const products = [];
            products.push({
                name: 'Darjeeling Black Tea 30 Envelopes',
                price: 30,
                category: 'black',
            });
            products.push({
                name: 'Roasted Oolong Tea 15 Envelopes',
                price: 20,
                category: 'oolong',
            });
            products.push({
                name: 'Hojicha Tea 20 Envelopes',
                price: 18.0,
                category: 'green',
            });
            products.push({
                name: 'Sippingly Calm & Relax Herbal Tea Collection 40 Teabags',
                price: 36.0,
                category: 'wellness',
            });
            products.push({
                name: 'Sippingly Immunity Booster Wellness Tea Collection 40 Teabags',
                price: 35.0,
                category: 'wellness',
            });
            products.push({
                name: 'Sippingly Healthy Gut Wellness Teas 40 Teabags',
                price: 32.0,
                category: 'wellness',
            });
            await productStore.createMultiple(products);
        }
        const user1 = {
            email: 'user1@dashboard.com',
            password_digest: 'user1234',
            first_name: 'Dash',
            last_name: 'Board',
            role: user_1.UserRole.Customer,
        };
        const user2 = {
            email: 'user2@dashboard.com',
            password_digest: 'user1234',
            first_name: 'Cash',
            last_name: 'Board',
            role: user_1.UserRole.Customer,
        };
        const userStore = new user_1.UserStore();
        const resUser1 = await userStore.create(user1);
        const resUser2 = await userStore.create(user2);
        const order1 = {
            status: order_1.OrderStatus.Active,
            user_id: resUser1.id,
        };
        const order2 = {
            status: order_1.OrderStatus.Active,
            user_id: resUser2.id,
        };
        const orderStore = new order_1.OrderStore();
        const resOrder1 = await orderStore.create(order1);
        await orderStore.addProduct(1, resOrder1.id, 1);
        await orderStore.addProduct(2, resOrder1.id, 2);
        await orderStore.addProduct(1, resOrder1.id, 3);
        await orderStore.addProduct(1, resOrder1.id, 4);
        await orderStore.addProduct(1, resOrder1.id, 5);
        const resOrder = await orderStore.create(order2);
        await orderStore.addProduct(1, resOrder.id, 1);
        await orderStore.addProduct(2, resOrder1.id, 2);
        await orderStore.addProduct(2, resOrder1.id, 3);
        await orderStore.addProduct(2, resOrder1.id, 4);
        await orderStore.addProduct(2, resOrder1.id, 6);
    });
    describe('productsInOrders(): This gets all products that have been included in orders', () => {
        it('should return more than 2 products', async () => {
            const result = await dash.productsInOrders();
            expect(result.length).toBeGreaterThanOrEqual(2);
        });
    });
    describe('topExpensiveProducts(): This gets top X expensive products', () => {
        it('should return top 5 expensive products', async () => {
            const result = await dash.topExpensiveProducts();
            expect(result.length).toBe(5);
        });
        it('should return top 3 expensive products', async () => {
            const result = await dash.topExpensiveProducts(3);
            expect(result.length).toBe(3);
        });
    });
    describe('topPopularProducts(): This gets top X popular products', () => {
        it('should return top 5 popular products', async () => {
            const result = await dash.topPopularProducts();
            expect(result.length).toBe(5);
        });
        it('should return top 3 popular products', async () => {
            const result = await dash.topPopularProducts(3);
            expect(result.length).toBe(3);
        });
    });
    describe('usersWithOrders(): This gets all users that have placed orders', () => {
        it('should return more than 2 users', async () => {
            const result = await dash.usersWithOrders();
            expect(result.length).toBeGreaterThanOrEqual(2);
        });
    });
});
