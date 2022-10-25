import supertest from 'supertest';
import app from '../../server';

describe('Dashboard Endpoint Testing', () => {
  const request = supertest(app);
  describe('This gets all products that have been included in orders', () => {
    it('should return 200 when requesting /dashboard/products_in_orders', () => {
      request.get('/dashboard/products_in_orders').expect(200);
    });
  });

  describe('This gets top X expensive products', () => {
    it('should return 200 when requesting /dashboard/top_expensive_products', () => {
      request.get('/dashboard/top_expensive_products').expect(200);
    });
    it('should return 200 when requesting /dashboard/top_expensive_products?limit=3', () => {
      request.get('/dashboard/top_expensive_products?limit=3').expect(200);
    });
    it('should return 400 when requesting /dashboard/top_expensive_products?limit=abc', () => {
      request.get('/dashboard/top_expensive_products?limit=abc').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_expensive_products?limit=-3', () => {
      request.get('/dashboard/top_expensive_products?limit=-3').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_expensive_products?limit=3.2', () => {
      request.get('/dashboard/top_expensive_products?limit=3.2').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_expensive_products?limit=', () => {
      request.get('/dashboard/top_expensive_products?limit=').expect(400);
    });
  });

  describe('This gets top X popular products', () => {
    it('should return 200 when requesting /dashboard/top_popular_products', () => {
      request.get('/dashboard/top_popular_products').expect(200);
    });
    it('should return 200 when requesting /dashboard/top_popular_products?limit=3', () => {
      request.get('/dashboard/top_popular_products?limit=3').expect(200);
    });
    it('should return 400 when requesting /dashboard/top_popular_products?limit=abc', () => {
      request.get('/dashboard/top_popular_products?limit=abc').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_popular_products?limit=-3', () => {
      request.get('/dashboard/top_popular_products?limit=-3').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_popular_products?limit=3.2', () => {
      request.get('/dashboard/top_popular_products?limit=3.2').expect(400);
    });
    it('should return 400 when requesting /dashboard/top_popular_products?limit=', () => {
      request.get('/dashboard/top_popular_products?limit=').expect(400);
    });
  });

  describe('This gets all users that have placed orders', () => {
    it('should return 200 when requesting /dashboard/users_with_orders', () => {
      request.get('/dashboard/users_with_orders').expect(200);
    });
  });
});
