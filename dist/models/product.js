"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
/**
 * Product CRUD operation class
 */
class ProductStore {
    /**
     * This gets all products asynchronously.
     * @returns a promise with array of product objects
     */
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    /**
     * This gets a list of products in a certain category asynchronously.
     * @param category required.
     * @returns a promise with array of product objects.
     */
    async indexByCategory(category) {
        try {
            if (category === '')
                throw new Error('Category is required.');
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products in ${category} category. Error: ${err}`);
        }
    }
    /**
     * This gets one product info asynchronously.
     * @param id product ID
     * @returns a promise with product object
     */
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error('Could not find such product.');
            }
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }
    /**
     * This creates a new product asynchronously.
     * @param p Product object. Name and price are required.
     * @returns a promise with newly created product object
     */
    async create(p) {
        try {
            if (p.name === '') {
                throw new Error('Product name is required.');
            }
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error('Could not create product.');
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new product ${p.name}. Error: ${err}`);
        }
    }
    /**
     * This creates multiple products at once asynchronously
     * @param products array of product objects.
     * @returns a promise with array of newly created product objects.
     */
    async createMultiple(products) {
        try {
            let sql = 'INSERT INTO products (name, price, category) VALUES ';
            const values = [];
            for (let i = 0; i < products.length; i++) {
                sql += i !== 0 ? ',' : '';
                const product = products[i];
                values.push(product.name);
                values.push(product.price);
                values.push(product.category);
                sql += `($${3 * i + 1}, $${3 * i + 2}, $${3 * i + 3})`;
            }
            sql += ' RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, values);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not add ${products.length} new products. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
