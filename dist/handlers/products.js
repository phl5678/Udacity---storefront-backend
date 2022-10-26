"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const auth_1 = require("../middlewares/auth");
const store = new product_1.ProductStore();
/**
 * This gets all products or a list of products in a given category if category query parameter is provided.
 * @param req http request. Category is optional in query parameter. If provided, returns products by category.
 * @param res http response. Returns product array.
 */
const index = async (req, res) => {
    try {
        const category = req.query.category;
        const products = category !== undefined
            ? await store.indexByCategory(category)
            : await store.index();
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This creates a product.
 * @param req http request. Name and price are required and category is optional in request body. Price needs to be number.
 * @param res http response. Returns the newly created product.
 */
const create = async (req, res) => {
    try {
        if (req.body.name === undefined || req.body.name === '')
            throw new Error('Product name is required.');
        if (req.body.price === undefined || req.body.price === '')
            throw new Error('Price is required ');
        const price = parseFloat(req.body.price);
        if (isNaN(price) === true)
            throw new Error('Price needs to be number. Ex. 18 or 18.99');
        const product = {
            name: req.body.name,
            price: price,
            category: req.body.category === undefined ? '' : req.body.category,
        };
        const result = await store.create(product);
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This creates multiple products at once.
 * @param req http request. A product array is required in request body.
 * @param res http response. Returns newly created products array.
 */
const createMultiple = async (req, res) => {
    try {
        if (req.body.products === undefined)
            throw new Error('A products array is required.');
        const products = req.body.products;
        if (products.length === 0)
            throw new Error('Products array is empty.');
        const result = await store.createMultiple(products);
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This gets one product by ID
 * @param req http request. Product ID is required in request parameter.
 * @param res http reponse. Returns a product
 */
const show = async (req, res) => {
    try {
        const product = await store.show(parseInt(req.params.pid));
        res.json(product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
/**
 * This defines the routes for products entity
 * @param app express Application.
 */
const productRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:pid', show);
    app.post('/products', auth_1.verifyAuthToken, create);
    app.post('/products/multiple', auth_1.verifyAuthToken, createMultiple); //Admin only for testing purpose.
};
exports.default = productRoutes;
