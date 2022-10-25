import Client from '../database';
/**
 * This class handles all SQL query for business analytics requests.
 */
class DashboardQueries {
  /**
   * This gets all products that have been included in orders.
   * @returns A custom object array with product id, product name, product price and order id.
   */
  async productsInOrders(): Promise<
    { id: number; name: string; price: number; order_id: string }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT a.id, a.name, a.price, b.order_id FROM products as a INNER JOIN order_products as b ON a.id = b.product_id ORDER BY a.id ASC';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }

  /**
   * This gets top X expensive products.
   * @param limit Positive integer. Default 5.
   * @returns A custom object array with product id, name, and price
   */
  async topExpensiveProducts(
    limit = 5
  ): Promise<{ id: string; name: string; price: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT id, name, price FROM products ORDER BY price DESC LIMIT ($1)';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get top ${limit} expensive products: ${err}`);
    }
  }

  /**
   * This gets top X popular products. Products that have been included in the orders the most.
   * @param limit Positive integer. Default 5.
   * @returns A custom object array with product id, name, price, and total orders count.
   */
  async topPopularProducts(
    limit = 5
  ): Promise<
    { id: number; name: string; price: number; total_orders: number }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT a.id, a.name, a.price, COUNT(b.order_id) as total_orders FROM products as a INNER JOIN order_products as b ON a.id = b.product_id GROUP BY a.id ORDER BY total_orders DESC LIMIT ($1)';

      const result = await conn.query(sql, [limit]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get top ${limit} popular products: ${err}`);
    }
  }

  /**
   * This gets users that have placed orders.
   * @returns A custom object array with user id, email, and total orders count
   */
  async usersWithOrders(): Promise<
    { id: number; email: string; total_orders: number }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT a.id, a.email, COUNT(b.id) AS total_orders FROM users AS a INNER JOIN orders AS b ON b.user_id = a.id GROUP BY a.id ORDER BY a.id ASC';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`);
    }
  }
}

export default DashboardQueries;
