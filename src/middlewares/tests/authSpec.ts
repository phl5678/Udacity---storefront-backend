import supertest from 'supertest';
import { User, UserRole } from '../../models/user';
import app from '../../server';
import { createAuthToken } from '../auth';

describe('Authenticatin Middleware Testing', () => {
  const request = supertest(app);
  describe('createAuthToken(): creates auth jwt token', () => {
    it('should return jwt token.', () => {
      const user: User = {
        id: 1,
        email: 'jwt@jwt.com',
        password_digest: '',
        role: UserRole.Customer,
      };
      const token = createAuthToken(user);
      expect(token).not.toBeNull();
    });
  });

  describe('verifyAuthToken() middleware', () => {
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
        email: 'admin@auth.com',
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
        email: 'user@auth.com',
        password: 'user1234',
      };
      const resUser = await request
        .post('/users')
        .send(user)
        .set('Accept', 'application/json');
      user.id = resUser.body.id.toString();
      user.token = resUser.body.token;

      user2 = {
        email: 'cx@auth.com',
        password: 'cx1234',
      };
      const resUser2 = await request
        .post('/users')
        .send(user2)
        .set('Accept', 'application/json');
      user2.id = resUser2.body.id.toString();
      user2.token = resUser2.body.token;
    });

    it('should return 200 when admin tries to get any user.', async () => {
      const response = await request
        .get(`/users/${user.id}`)
        .auth(admin.token as string, { type: 'bearer' });
      expect(response.status).toEqual(200);
    });
    it('should return 200 when the user tries to get his own info.', async () => {
      const response = await request
        .get(`/users/${user.id}`)
        .auth(user.token as string, { type: 'bearer' });
      expect(response.status).toEqual(200);
    });
    it('should return 401 when a user tries to get other user info.', async () => {
      const response = await request
        .get(`/users/${user.id}`)
        .auth(user2.token as string, { type: 'bearer' });
      expect(response.status).toEqual(401);
    });
  });
});
