"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../order");
const product_1 = require("../product");
const user_1 = require("../user");
describe('Orders Model Testing', () => {
    const store = new order_1.OrderStore();
    let user_id;
    beforeAll(async () => {
        const user = {
            email: 'user@ordermodel.com',
            password_digest: 'user1234',
            first_name: 'Hello',
            last_name: 'World',
            role: user_1.UserRole.Customer,
        };
        const result = await new user_1.UserStore().create(user);
        user_id = result.id;
    });
    describe(`This create a new order.`, () => {
        it(`should return a order object with id not null`, async () => {
            const order = {
                status: order_1.OrderStatus.Active,
                user_id: user_id,
            };
            const result = await store.create(order);
            expect(result.id).not.toBeNull();
            expect(result.status).toBe(order.status);
            expect(result.user_id == user_id).toBeTrue();
        });
        it(`should be rejected with error if user ID does not exists.`, async () => {
            const order = {
                status: order_1.OrderStatus.Active,
                user_id: 200,
            };
            await expectAsync(store.create(order)).toBeRejectedWithError();
        });
    });
    describe(`This gets all/active/complete orders for a user.`, () => {
        beforeAll(async () => {
            const order = {
                status: order_1.OrderStatus.Complete,
                user_id: user_id,
            };
            await store.create(order);
        });
        it(`should return 2 orders`, async () => {
            const result = await store.index4User(user_id);
            expect(result.length).toEqual(2);
        });
        it(`should 1 active order`, async () => {
            const result = await store.index4UserByStatus(user_id, order_1.OrderStatus.Active);
            expect(result.length).toEqual(1);
        });
        it(`should 1 complete order`, async () => {
            const result = await store.index4UserByStatus(user_id, order_1.OrderStatus.Complete);
            expect(result.length).toEqual(1);
        });
    });
    describe(`This adds a product to an order. POST /users/:uid/orders/:oid/products`, () => {
        let order_id = 0;
        beforeAll(async () => {
            const order = {
                status: order_1.OrderStatus.Active,
                user_id: user_id,
            };
            const res = await store.create(order);
            order_id = res.id;
            const productStore = new product_1.ProductStore();
            const resProducts = await productStore.index();
            if (resProducts.length < 2) {
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
                await productStore.createMultiple(products);
            }
        });
        it(`should return object {not null id, quantity, product id, order id}.`, async () => {
            const orderProduct = {
                quantity: 1,
                product_id: 1,
            };
            const result = await store.addProduct(orderProduct.quantity, order_id, orderProduct.product_id);
            expect(result.id).not.toBeNull();
        });
        it(`should be rejected when product id does not exist.`, async () => {
            const orderProduct = {
                quantity: 1,
                product_id: 100,
            };
            await expectAsync(store.addProduct(orderProduct.quantity, order_id, orderProduct.product_id)).toBeRejectedWithError();
        });
        it(`should be rejected when order id does not exist.`, async () => {
            const orderProduct = {
                quantity: 1,
                product_id: 1,
            };
            await expectAsync(store.addProduct(orderProduct.quantity, 100, orderProduct.product_id)).toBeRejectedWithError();
        });
        describe(`This gets products included in a order`, () => {
            it('should return 1 product. ', async () => {
                const result = await store.showOrder(order_id);
                expect(result.length).toEqual(1);
            });
        });
    });
});
