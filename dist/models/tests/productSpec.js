"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../product");
describe('Products Model Testing', () => {
    const store = new product_1.ProductStore();
    describe('This create a new product (id not null)', () => {
        it('should return product object with id = 1', async () => {
            const product = {
                name: 'Chamomile Herbal Teas 20 Teabags',
                price: 18.0,
                category: 'herbal',
            };
            const result = await store.create(product);
            expect(result.id).not.toBeNull();
            expect(result.name).toBe(product.name);
            expect(result.price).toBeCloseTo(product.price);
            expect(result.category).toBe(product.category);
        });
        it('should be rejected with error when name is empty', async () => {
            const product = {
                name: '',
                price: 18.0,
                category: 'herbal',
            };
            await expectAsync(store.create(product)).toBeRejectedWithError();
        });
    });
    describe('This create multiple new products at once', () => {
        it('should product arrays with length 6.', async () => {
            const products = [];
            products.push({
                name: 'Ceylon Black Tea 30 Envelopes',
                price: 30.0,
                category: 'black',
            });
            products.push({
                name: 'Sun Moon Lake Black Tea 15 Envelopes',
                price: 20.0,
                category: 'black',
            });
            products.push({
                name: 'Matcha Green Tea 20 Sticks',
                price: 18.0,
                category: 'green',
            });
            products.push({
                name: 'Calm & Relax Herbal Tea Collection 40 Teabags',
                price: 36.0,
                category: 'wellness',
            });
            products.push({
                name: 'Immunity Booster Wellness Tea Collection 40 Teabags',
                price: 35.0,
                category: 'wellness',
            });
            products.push({
                name: 'Sippingly Healthy Gut Wellness Teas 40 Teabags',
                price: 32.0,
                category: 'wellness',
            });
            const result = await store.createMultiple(products);
            expect(result.length).toBe(6);
            products.forEach((p) => {
                expect(p.id).not.toBeNull();
            });
        });
    });
    describe('This gets all products', () => {
        it('should return product array with length >= 7', async () => {
            const result = await store.index();
            expect(result.length).toBeGreaterThanOrEqual(7);
        });
    });
    describe('This gets all products in certain catogory', () => {
        it('should return product array with length >= 3 and category=wellness', async () => {
            const result = await store.indexByCategory('wellness');
            expect(result.length).toBeGreaterThanOrEqual(3);
            result.forEach((p) => {
                expect(p.category).toBe('wellness');
            });
        });
        it('should be rejected with error when category value is empty', async () => {
            await expectAsync(store.indexByCategory('')).toBeRejectedWithError();
        });
        it('should empty array when category value does not exist', async () => {
            const result = await store.indexByCategory('whatever');
            expect(result.length).toBe(0);
        });
    });
    describe('This gets one product', () => {
        it('should return producr object with id = 1 ', async () => {
            const result = await store.show(1);
            expect(result.id).toBe(1);
        });
        it('should be rejected with error when id does not exists ', async () => {
            await expectAsync(store.show(100)).toBeRejectedWithError();
        });
    });
});
