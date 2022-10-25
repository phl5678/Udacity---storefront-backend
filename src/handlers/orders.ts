import express, { Request, Response } from 'express';
import { Order, OrderStore, OrderStatus } from '../models/order';
import { verifyAuthToken } from '../middlewares/auth';

const store = new OrderStore();

interface RequestQuery {
  status?: string;
}

/**
 * This gets all orders for a given user or a list of orders by status for a given user if status query parameter is provided.
 * @param req http request. User ID is required. Status query parameter is optional. If provided, orders are filtered by status.
 * @param res http response. Returns order array.
 */
const index4User = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = (req.query as unknown as RequestQuery).status as OrderStatus;
    const orders =
      status !== undefined
        ? await store.index4UserByStatus(parseInt(req.params.uid), status)
        : await store.index4User(parseInt(req.params.uid));
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This creates a new order for a user.
 * @param req http request. User ID is required in the request params. Order status is optional in request body and defaults to 'active'.
 * @param res http response. Returns the newly-created order.
 */
const create4User = async (req: Request, res: Response): Promise<void> => {
  try {
    const status =
      req.body.status === undefined || req.body.status.length === 0
        ? OrderStatus.Active
        : req.body.status;
    const order: Order = {
      status: status,
      user_id: parseInt(req.params.uid),
    };

    const result = await store.create(order);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This adds a product and quantity to an active order. Throw error if the order is complete.
 * @param req http request. Order ID is required in request parameters. Quantity (positivie integer) and product ID (positive integer) are both required in the request body.
 * @param res http response. Returns the newly added products info for the given order.
 */
const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.oid);
    const { quantity, product_id } = req.body;

    if (
      quantity === undefined ||
      isNaN(Number(quantity)) ||
      Number(quantity) <= 0 ||
      Number.isInteger(quantity) === false
    ) {
      throw new Error('Quantity is required.');
    }
    if (
      product_id === undefined ||
      isNaN(Number(product_id)) ||
      Number(product_id) <= 0 ||
      Number.isInteger(product_id) === false
    ) {
      throw new Error('Product ID is invalid.');
    }

    const order = await store.show(order_id);
    if (order.status === OrderStatus.Complete) {
      throw new Error(
        `The order has been closed. Cannot add product ${product_id} to order ${order_id}`
      );
    }

    const result = await store.addProduct(
      parseInt(quantity),
      order_id,
      parseInt(product_id)
    );
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This gets the products info for a given order.
 * @param req http request. Order ID is required in request parameter.
 * @param res http response. Returns the order info including id, quantity, product id, order id, product name, product price, product category,
 */
const showOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.oid);
    const result = await store.showOrder(order_id);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This defines the routes for order entity.
 * @param app express application
 */
const orderRoutes = (app: express.Application) => {
  // app.get('/orders', verifyAuthToken, index);
  // app.get('/orders/:oid', verifyAuthToken, show);

  app.get('/users/:uid/orders', verifyAuthToken, index4User);
  app.post('/users/:uid/orders', verifyAuthToken, create4User);
  app.get('/users/:uid/orders/:oid/products', verifyAuthToken, showOrder);
  app.post('/users/:uid/orders/:oid/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
