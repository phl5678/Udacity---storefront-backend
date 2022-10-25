import supertest from 'supertest';
import { OrderStatus } from '../../models/order';
import { UserRole } from '../../models/user';
import app from '../../server';

describe('Orders Endpoint Testing', () => {
  const request = supertest(app);

  interface AuthUser {
    id?: string;
    email: string;
    password: string;
    role?: string;
    token?: string;
  }

  let admin: AuthUser;
  let user: AuthUser;
  let user2: AuthUser;
  beforeAll(async () => {
    admin = {
      email: 'admin@orders.com',
      password: 'admin1234',
      role: UserRole.Admin,
    };
    const resAdmin = await request
      .post('/users')
      .send(admin)
      .set('Accept', 'application/json');
    admin.id = resAdmin.body.id.toString();
    admin.token = resAdmin.body.token;

    user = {
      email: 'user@orders.com',
      password: 'user1234',
    };
    const resUser = await request
      .post('/users')
      .send(user)
      .set('Accept', 'application/json');
    user.id = resUser.body.id.toString();
    user.token = resUser.body.token;

    user2 = {
      email: 'cx@orders.com',
      password: 'cx1234',
    };
    const resUser2 = await request
      .post('/users')
      .send(user2)
      .set('Accept', 'application/json');
    user2.id = resUser2.body.id.toString();
    user2.token = resUser2.body.token;
  });

  describe(`This create a new order. POST /users/:uid/orders`, () => {
    it(`should return 200, json content type, matched body.user_id when posting /users/:uid/orders with user's own token`, async () => {
      const order = {
        status: OrderStatus.Active,
        user_id: user.id,
      };
      const response = await request
        .post(`/users/${user.id}/orders`)
        .send(order)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.user_id).toEqual(user.id);
    });
    it(`should return 200, json content type, order id when posting /users/:uid/orders with admin token`, async () => {
      const order = {
        status: OrderStatus.Active,
        user_id: user.id,
      };
      const response = await request
        .post(`/users/${user.id}/orders`)
        .send(order)
        .auth(admin.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeGreaterThan(0);
    });
    it("should return 401 when posting /users/:uid/orders with someone else's token", async () => {
      const order = {
        status: OrderStatus.Active,
        user_id: user.id,
      };
      const response = await request
        .post(`/users/${user.id}/orders`)
        .auth(user2.token as string, { type: 'bearer' })
        .send(order)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(401);
    });
  });

  describe(`This gets all/active/complete orders for a user. GET /users/:uid/orders`, () => {
    beforeAll(async () => {
      const order = {
        status: OrderStatus.Complete,
        user_id: user.id,
      };
      await request
        .post(`/users/${user.id}/orders`)
        .send(order)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
    });
    it(`should return 200, json content type, 3 orders when getting /users/:uid/orders with user's own token`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.length).toEqual(3);
    });

    it(`should return 200, json content type, 3 orders when getting /users/:uid/orders with admin token`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders`)
        .auth(admin.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.length).toEqual(3);
    });

    it(`should return 401 when getting /users/:uid/orders with someone else' token`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders`)
        .auth(user2.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(401);
    });

    it(`should return 200 and 2 active orders when getting /users/:uid/orders?status=active`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders?status=active`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(2);
    });
    it(`should return 200 and 0 orders when getting /users/:uid/orders?status=`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders?status=`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
    it(`should return 200 and 1 complete orders when getting /users/:uid/orders?status=complete`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders?status=complete`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
    });
    it(`should return 200 and 0 order when getting /users/:uid/orders?status=random`, async () => {
      const response = await request
        .get(`/users/${user.id}/orders?status=random`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });

  describe(`This adds a product to an order. POST /users/:uid/orders/:oid/products`, () => {
    let order_id = 0;
    beforeAll(async () => {
      const order = {
        status: OrderStatus.Active,
        user_id: user.id,
      };
      const res = await request
        .post(`/users/${user.id}/orders`)
        .send(order)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      order_id = res.body.id;

      const resProducts = await request.get('/products');
      if (resProducts.body.length < 2) {
        const products = [];
        products.push({
          name: 'Ceylon Black Tea 30 Envelopes',
          price: '30',
          category: 'black',
        });
        products.push({
          name: 'Sun Moon Lake Black Tea 15 Envelopes',
          price: '20',
          category: 'black',
        });
        products.push({
          name: 'Matcha Green Tea 20 Sticks',
          price: '18',
          category: 'green',
        });
        products.push({
          name: 'Calm & Relax Herbal Tea Collection 40 Teabags',
          price: '36',
          category: 'wellness',
        });
        products.push({
          name: 'Immunity Booster Wellness Tea Collection 40 Teabags',
          price: '35',
          category: 'wellness',
        });
        products.push({
          name: 'Sippingly Healthy Gut Wellness Teas 40 Teabags',
          price: '32',
          category: 'wellness',
        });
        await request
          .post('/products/multiple')
          .send({ products: products })
          .auth(admin.token as string, { type: 'bearer' })
          .set('Accept', 'application/json');
      }
    });
    it(`should return 200, json when adding product to user's own order. i.e. posting /users/:uid/orders/:oid/products with user's own token`, async () => {
      const orderProduct = {
        quantity: 1,
        product_id: 1,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeGreaterThan(0);
    });

    it(`should return 200, json content type when admin adding product to any order. i.e. posting /users/:uid/orders/:oid/products with admin token`, async () => {
      const orderProduct = {
        quantity: 1,
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(admin.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeGreaterThan(0);
    });

    it(`should return 400 when user adding product to a complete order.`, async () => {
      const res = await request
        .get(`/users/${user.id}/orders?status=complete`)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      const complete_order_id = res.body[0].id;

      const orderProduct = {
        quantity: 1,
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${complete_order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });

    it(`should return 400 when user adding product without passing quantity.`, async () => {
      const orderProduct = {
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });
    it(`should return 400 when user adding product with 0 quantity.`, async () => {
      const orderProduct = {
        quantity: 0,
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });
    it(`should return 400 when user adding product with non number quantity.`, async () => {
      const orderProduct = {
        quantity: 'abcde',
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });
    it(`should return 400 when user adding product with -3 quantity.`, async () => {
      const orderProduct = {
        quantity: -3,
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });
    it(`should return 400 when user adding product with 3.15 quantity.`, async () => {
      const orderProduct = {
        quantity: 3.15,
        product_id: 2,
      };

      const response = await request
        .post(`/users/${user.id}/orders/${order_id}/products`)
        .send(orderProduct)
        .auth(user.token as string, { type: 'bearer' })
        .set('Accept', 'application/json');
      expect(response.status).toEqual(400);
    });

    describe(`This gets products included in a order`, () => {
      it("should return 200 and 2 products. GET /users/:uid/orders/:oid/products with user's own token", async () => {
        const response = await request
          .get(`/users/${user.id}/orders/${order_id}/products`)
          .auth(user.token as string, { type: 'bearer' })
          .set('Accept', 'application/json');
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.length).toEqual(2);
      });
      it("should return 200 and 2 products. GET /users/:uid/orders/:oid/products with admin' token", async () => {
        const response = await request
          .get(`/users/${user.id}/orders/${order_id}/products`)
          .auth(admin.token as string, { type: 'bearer' })
          .set('Accept', 'application/json');
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.length).toEqual(2);
      });
      it("should return 401. GET /users/:uid/orders/:oid/products with someone else' token", async () => {
        const response = await request
          .get(`/users/${user.id}/orders/${order_id}/products`)
          .auth(user2.token as string, { type: 'bearer' })
          .set('Accept', 'application/json');
        expect(response.status).toEqual(401);
      });
    });
  });
});
