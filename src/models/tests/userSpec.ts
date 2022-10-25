import { User, UserRole, UserStore } from '../user';

describe('Users Model Testing', () => {
  const store = new UserStore();
  describe('This create a new admin user', () => {
    it('should return a not null ID, same email, different password (plain vs digest), same first last name, and admin role.', async () => {
      const user: User = {
        email: 'admin@users.com',
        password_digest: 'admin1234',
        first_name: 'Admin',
        last_name: 'Nimda',
        role: UserRole.Admin,
      };

      const result = await store.create(user);
      expect(result.id).not.toBeNull();
      expect(result.email).toBe(user.email);
      expect(result.password_digest).not.toBe(user.password_digest);
      expect(result.first_name).toBe(user.first_name);
      expect(result.last_name).toBe(user.last_name);
      expect(result.role).toBe(UserRole.Admin);
    });
  });
  describe('This create a new customer', () => {
    it('should return a not null ID, same email, different password (plain vs digest), same first last name, and customer role.', async () => {
      const user = {
        email: 'user@users.com',
        password_digest: 'user1234',
        first_name: 'User',
        last_name: 'Resu',
      };

      const result = await store.create(user);
      expect(result.id).not.toBeNull();
      expect(result.email).toBe(user.email);
      expect(result.password_digest).not.toBe(user.password_digest);
      expect(result.first_name).toBe(user.first_name);
      expect(result.last_name).toBe(user.last_name);
      expect(result.role).toBe(UserRole.Customer);
    });
    it('should be rejected and throw error if empty email', async () => {
      const user = {
        email: '',
        password_digest: 'user1234',
      };
      await expectAsync(store.create(user)).toBeRejectedWithError();
    });
    it('should be rejected and throw error if password is empty', async () => {
      const user = {
        email: 'user@users.com',
        password_digest: '',
      };
      await expectAsync(store.create(user)).toBeRejectedWithError();
    });
  });

  describe('This authenticates a user', () => {
    it('should authenticate the user and return an object {isAuth: true, user:User}', async () => {
      const user = {
        email: 'admin@users.com',
        password: 'admin1234',
      };
      const result = await store.authenticate(user.email, user.password);
      expect(result).toBeInstanceOf(Object);
      expect(result).not.toBeNull();
      expect(result?.isAuth).toBeDefined();
      expect(result?.isAuth).toBeTrue();
      expect(result?.user).toBeDefined();
      expect(result?.user.id).not.toBeNull();
      expect(result?.user.email).toBe(user.email);
      expect(result?.user.password_digest).not.toBe(user.password);
      expect(result?.user.role).not.toBeNull();
    });

    it('should not authenticate the user and return an object {isAuth: false, user:User} with existing email and a bad password', async () => {
      const user = {
        email: 'admin@users.com',
        password: 'badpassword',
      };
      const result = await store.authenticate(user.email, user.password);
      expect(result).toBeInstanceOf(Object);
      expect(result).not.toBeNull();
      expect(result?.isAuth).toBeDefined();
      expect(result?.isAuth).toBeFalse();
      expect(result?.user).toBeDefined();
      expect(result?.user.id).not.toBeNull();
      expect(result?.user.email).toBe(user.email);
      expect(result?.user.password_digest).not.toBe(user.password);
      expect(result?.user.role).not.toBeNull();
    });

    it('should not authenticate the user and return null with non-existing email', async () => {
      const user = {
        email: 'ghost@users.com',
        password: 'badpassword',
      };
      const result = await store.authenticate(user.email, user.password);
      expect(result).toBeNull();
    });
  });

  describe('This gets all users', () => {
    it('should return more than 2 users', async () => {
      const result = await store.index();
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('This gets one user', () => {
    it('should return user id=2 info', async () => {
      const result = await store.show(2);
      expect(result.id).toBe(2);
      expect(result.email).not.toBeNull();
      expect(result.password_digest).not.toBeNull();
    });

    it('should be rejected with error when no such user exists', async () => {
      await expectAsync(store.show(200)).toBeRejectedWithError();
    });
  });
});
