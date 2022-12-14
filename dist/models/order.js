"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = exports.OrderStatus = void 0;
const database_1 = __importDefault(require("../database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Active"] = "active";
    OrderStatus["Complete"] = "complete";
})(OrderStatus || (OrderStatus = {}));
exports.OrderStatus = OrderStatus;
/**
 * Order CRUD operation class
 */
class OrderStore {
    /**
     * This gets one order by ID
     * @param id order ID.
     * @returns a promise with an order object with status and user id.
     */
    async show(id) {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error('Could not find such order.');
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }
    /**
     * This gets all orders for a user asynchronously
     * @param userId User ID is required.
     * @returns a promise with array of custom order info object containing order id, product id, name, price, quantity, user id, and order status.
     */
    async index4User(userId) {
        try {
            const sql = 'SELECT a.id as order_id, b.product_id, c.name as product_name, c.price as product_price, b.quantity, a.user_id, a.status as order_status FROM orders as a LEFT JOIN order_products as b ON a.id=b.order_id LEFT JOIN products as c ON c.id = b.product_id WHERE a.user_id=($1) ORDER BY order_id ASC';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not find order for user ${userId}. Error: ${err}`);
        }
    }
    /**
     * This gets a list of orders in certain status for a user asynchronously.
     * @param userId User ID is required.
     * @param status Status is required.
     * @returns a promise with array of custom order info object containing order id, product id, name, price, quantity, user id, and order status.
     */
    async index4UserByStatus(userId, status) {
        try {
            const sql = 'SELECT a.id as order_id, b.product_id, c.name as product_name,c.price as product_price, b.quantity, a.user_id, a.status as order_status FROM orders as a LEFT JOIN order_products as b ON a.id=b.order_id LEFT JOIN products as c ON c.id = b.product_id WHERE a.user_id=($1) and status=($2) ORDER BY order_id ASC';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [userId, status]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not find order status ${status} for user ${userId}. Error: ${err}`);
        }
    }
    /**
     * This adds a product to a order asynchronously.
     * @param quantity Quantity of the product.
     * @param orderId ID of the order that the product is going to be added to.
     * @param productId Product ID
     * @returns a promise with a customer ordered product info containing line (order_products) id, quantity, product id, and order id
     */
    async addProduct(quantity, orderId, productId) {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [quantity, orderId, productId]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error('Could not add product.');
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}. Error: ${err}`);
        }
    }
    /**
     * This gets one order info asynchronously.
     * @param orderId Order ID
     * @returns a promise with array of customer order info containing quantity, product id, name, price, user ID and order status
     */
    async showOrder(orderId) {
        try {
            const sql = 'SELECT a.quantity, a.product_id, a.order_id, b.name as product_name, b.price as product_price, c.user_id, c.status as order_status FROM order_products as a LEFT JOIN products as b ON b.id=a.product_id INNER JOIN orders as c ON c.id = a.order_id WHERE order_id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products for order ${orderId}. Error: ${err}`);
        }
    }
    /**
     * This creates an order for a user asynchronously.
     * @param o Order object. Status and user ID are required.
     * @returns a promise with an order object.
     */
    async create(o) {
        try {
            if (o.user_id <= 0)
                throw new Error('User ID is invalid');
            if (o.status === '')
                o.status = OrderStatus.Active;
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [o.status, o.user_id]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error('Could not create order.');
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add new order for user ${o.user_id}. Error: ${err}`);
        }
    }
    /**
     * This updates the order status for a order.
     * @param o Order object. id, status, and user id are required.
     * @returns a promise with Order object
     */
    async updateStatus(o) {
        try {
            if (o.id === undefined || o.id <= 0)
                throw new Error('Order ID is required');
            const sql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [o.status, o.id]);
            conn.release();
            if (result.rows.length === 0)
                throw new Error('Could not update order status.');
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update order status for order ${o.id}. Error: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
