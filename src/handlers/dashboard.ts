import express, { Request, Response } from 'express';

import DashboardQueries from '../services/dashboard';

const dashboard = new DashboardQueries();
interface RequestQuery {
  limit: number;
}
/**
 * This gets all products that have been included in orders.
 * @param _req http request object (unused)
 * @param res http response object
 */
const productsInOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const result = await dashboard.productsInOrders();
  res.json(result);
};

/**
 * This gets top X expensive products. Default 5. To change, add limit=x in the URL query. x is positive integer.
 * Ex. this gets top 3 expensive products: /dashboard/top_expensive_products?limit=3
 * @param req http request object
 * @param res http response object
 */
const topExpensiveProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as RequestQuery;
    let limit = query.limit === undefined ? 5 : query.limit;
    limit = Number(limit);
    if (isNaN(limit) || Number.isInteger(limit) === false || limit <= 0) {
      throw new Error('invalid limit query value.');
    }
    const result = await dashboard.topExpensiveProducts(limit);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This gets top X popular products (products that have been included in the order the most).
 * Default 5. To change, add limit=x in the URL query. x is positive integer.
 * Ex. this gets top 3 popular products: /dashboard/top_popular_products?limit=3
 * @param req http request object
 * @param res http response object
 */
const topPopularProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as RequestQuery;
    let limit = query.limit === undefined ? 5 : query.limit;
    limit = Number(limit);
    if (isNaN(limit) || Number.isInteger(limit) === false || limit <= 0) {
      throw new Error('invalid limit query value.');
    }
    const result = await dashboard.topPopularProducts(limit);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json((err as unknown as Error).message);
  }
};

/**
 * This gets all users that have placed orders.
 * @param _req http request object (unused)
 * @param res http response object
 */
const usersWithOrders = async (_req: Request, res: Response): Promise<void> => {
  const result = await dashboard.usersWithOrders();
  res.json(result);
};
const dashboardRoutes = (app: express.Application): void => {
  app.get('/dashboard/products_in_orders', productsInOrders);
  app.get('/dashboard/top_expensive_products', topExpensiveProducts);
  app.get('/dashboard/top_popular_products', topPopularProducts);
  app.get('/dashboard/users_with_orders', usersWithOrders);
};

export default dashboardRoutes;
