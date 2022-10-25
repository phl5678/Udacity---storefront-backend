"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var product_1 = require("../models/product");
var auth_1 = require("../middlewares/auth");
var store = new product_1.ProductStore();
/**
 * This gets all products or a list of products in a given category if category query parameter is provided.
 * @param req http request. Category is optional in query parameter. If provided, returns products by category.
 * @param res http response. Returns product array.
 */
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category, products, _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                category = req.query.category;
                if (!(category !== undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, store.indexByCategory(category)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, store.index()];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                products = _a;
                res.json(products);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                res.status(400);
                res.json(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * This creates a product.
 * @param req http request. Name and price are required and category is optional in request body. Price needs to be number.
 * @param res http response. Returns the newly created product.
 */
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var price, product, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (req.body.name === undefined || req.body.name === '')
                    throw new Error('Product name is required.');
                if (req.body.price === undefined || req.body.price === '')
                    throw new Error('Price is required ');
                price = parseFloat(req.body.price);
                if (isNaN(price) === true)
                    throw new Error('Price needs to be number. Ex. 18 or 18.99');
                product = {
                    name: req.body.name,
                    price: price,
                    category: req.body.category === undefined ? '' : req.body.category
                };
                return [4 /*yield*/, store.create(product)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400);
                res.json(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This creates multiple products at once.
 * @param req http request. A product array is required in request body.
 * @param res http response. Returns newly created products array.
 */
var createMultiple = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (req.body.products === undefined)
                    throw new Error('A products array is required.');
                products = req.body.products;
                if (products.length === 0)
                    throw new Error('Products array is empty.');
                return [4 /*yield*/, store.createMultiple(products)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(400);
                res.json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This gets one product by ID
 * @param req http request. Product ID is required in request parameter.
 * @param res http reponse. Returns a product
 */
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.show(parseInt(req.params.pid))];
            case 1:
                product = _a.sent();
                res.json(product);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(400);
                res.json(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This defines the routes for products entity
 * @param app express Application.
 */
var productRoutes = function (app) {
    app.get('/products', index);
    app.get('/products/:pid', show);
    app.post('/products', auth_1.verifyAuthToken, create);
    app.post('/products/multiple', auth_1.verifyAuthToken, createMultiple); //Admin only for testing purpose.
};
exports["default"] = productRoutes;
