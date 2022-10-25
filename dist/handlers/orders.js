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
var order_1 = require("../models/order");
var auth_1 = require("../middlewares/auth");
var store = new order_1.OrderStore();
/**
 * This gets all orders for a given user or a list of orders by status for a given user if status query parameter is provided.
 * @param req http request. User ID is required. Status query parameter is optional. If provided, orders are filtered by status.
 * @param res http response. Returns order array.
 */
var index4User = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, orders, _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                status_1 = req.query.status;
                if (!(status_1 !== undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, store.index4UserByStatus(parseInt(req.params.uid), status_1)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, store.index4User(parseInt(req.params.uid))];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                orders = _a;
                res.json(orders);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                res.status(400);
                res.json(err_1.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * This creates a new order for a user.
 * @param req http request. User ID is required in the request params. Order status is optional in request body and defaults to 'active'.
 * @param res http response. Returns the newly-created order.
 */
var create4User = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_2, order, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                status_2 = req.body.status === undefined || req.body.status.length === 0
                    ? order_1.OrderStatus.Active
                    : req.body.status;
                order = {
                    status: status_2,
                    user_id: parseInt(req.params.uid)
                };
                return [4 /*yield*/, store.create(order)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400);
                res.json(err_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This adds a product and quantity to an active order. Throw error if the order is complete.
 * @param req http request. Order ID is required in request parameters. Quantity (positivie integer) and product ID (positive integer) are both required in the request body.
 * @param res http response. Returns the newly added products info for the given order.
 */
var addProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order_id, _a, quantity, product_id, order, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                order_id = parseInt(req.params.oid);
                _a = req.body, quantity = _a.quantity, product_id = _a.product_id;
                if (quantity === undefined ||
                    isNaN(Number(quantity)) ||
                    Number(quantity) <= 0 ||
                    Number.isInteger(quantity) === false) {
                    throw new Error('Quantity is required.');
                }
                if (product_id === undefined ||
                    isNaN(Number(product_id)) ||
                    Number(product_id) <= 0 ||
                    Number.isInteger(product_id) === false) {
                    throw new Error('Product ID is invalid.');
                }
                return [4 /*yield*/, store.show(order_id)];
            case 1:
                order = _b.sent();
                if (order.status === order_1.OrderStatus.Complete) {
                    throw new Error("The order has been closed. Cannot add product ".concat(product_id, " to order ").concat(order_id));
                }
                return [4 /*yield*/, store.addProduct(parseInt(quantity), order_id, parseInt(product_id))];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(400);
                res.json(err_3.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * This gets the products info for a given order.
 * @param req http request. Order ID is required in request parameter.
 * @param res http response. Returns the order info including id, quantity, product id, order id, product name, product price, product category,
 */
var showOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order_id, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                order_id = parseInt(req.params.oid);
                return [4 /*yield*/, store.showOrder(order_id)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(400);
                res.json(err_4.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This defines the routes for order entity.
 * @param app express application
 */
var orderRoutes = function (app) {
    // app.get('/orders', verifyAuthToken, index);
    // app.get('/orders/:oid', verifyAuthToken, show);
    app.get('/users/:uid/orders', auth_1.verifyAuthToken, index4User);
    app.post('/users/:uid/orders', auth_1.verifyAuthToken, create4User);
    app.get('/users/:uid/orders/:oid/products', auth_1.verifyAuthToken, showOrder);
    app.post('/users/:uid/orders/:oid/products', auth_1.verifyAuthToken, addProduct);
};
exports["default"] = orderRoutes;
