import express, { Request, Response } from 'express';
import { Order, OrderStore, OrderStatus } from '../models/order';
import { verifyAuthToken } from '../middlewares/auth';

const store = new OrderStore();

interface RequestQuery {
  status?: OrderStatus;
}
interface OrderQuery {
  user_id: number;
  order_status: OrderStatus;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}
interface OrderProductShape {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface OrderShape {
  order_id: number;
  order_status: OrderStatus;
  user_id: number;
  products: OrderProductShape[];
}
/**
 * This gets all orders for a given user or a list of orders by status for a given user if status query parameter is provided.
 * @param req http request. User ID is required. Status query parameter is optional. If provided, orders are filtered by status.
 * @param res http response. Returns array of custom order product info for the cart {order_id, order_status, user_id, products}
 * where products is an array of {product_id, product_name, product_price, quantity}.
 */
const index4User = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = (req.query as unknown as RequestQuery).status;
    const orders =
      status !== undefined
        ? await store.index4UserByStatus(parseInt(req.params.uid), status)
        : await store.index4User(parseInt(req.params.uid));

    const updatedOrders: OrderShape[] = [];
    if (orders.length > 0) {
      let current_order_id = orders[0].order_id;
      let products: OrderProductShape[] = [];
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].product_id !== null) {
          products.push({
            product_id: orders[i].product_id,
            product_name: orders[i].product_name,
            product_price: orders[i].product_price,
            quantity: orders[i].quantity,
          });
        }
        if (
          i + 1 === orders.length ||
          current_order_id !== orders[i + 1].order_id
        ) {
          updatedOrders.push({
            order_id: current_order_id,
            order_status: orders[i].order_status as OrderStatus,
            user_id: orders[i].user_id,
            products: products,
          });
          products = [];
          current_order_id = i + 1 < orders.length ? orders[i + 1].order_id : 0;
        }
      }
    }
    res.json(updatedOrders);
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
 * This updates the status of an order.
 * @param req http request. status is required in the request body.
 * @param res http response. Return the order object.
 */
const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.body.status;
    if (status === undefined || status.length === 0) {
      throw new Error('Status is required.');
    }

    const order: Order = {
      id: parseInt(req.params.oid),
      status: status,
      user_id: parseInt(req.params.uid),
    };
    const result = await store.updateStatus(order);
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
 * @param res http response. Returns the custom order info {order_id, order_status, user_id, products} where products is an array of
 * {product_id, product_name, product_price, quantity}
 */
const showOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.oid);
    const result: OrderQuery[] = await store.showOrder(order_id);

    let updatedOrders: OrderShape | null = null;

    if (result.length > 0) {
      let products: OrderProductShape[] = [];
      for (let i = 0; i < result.length; i++) {
        products.push({
          product_id: result[i].product_id,
          product_name: result[i].product_name,
          product_price: result[i].product_price,
          quantity: result[i].quantity,
        });
        if (i + 1 === result.length) {
          updatedOrders = {
            order_id: order_id,
            order_status: result[i].order_status as OrderStatus,
            user_id: result[i].user_id,
            products: products,
          };
          products = [];
        }
      }
    }
    res.json(updatedOrders);
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
  app.get('/users/:uid/orders', verifyAuthToken, index4User);
  app.post('/users/:uid/orders', verifyAuthToken, create4User);
  app.put('/users/:uid/orders/:oid', verifyAuthToken, updateStatus);
  app.get('/users/:uid/orders/:oid/products', verifyAuthToken, showOrder);
  app.post('/users/:uid/orders/:oid/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
