import { default as Client, BCRYPT_PASSWORD, SALT_ROUNDS } from '../database';
import bcrypt from 'bcrypt';

type User = {
  id?: number;
  email: string;
  password_digest: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

enum UserRole {
  Admin = 'admin',
  Customer = 'customer',
  Staff = 'staff',
}

/**
 * User CRUD operation class
 */
class UserStore {
  /**
   * This gets all users asynchronously.
   * @returns a promist with array of user objects.
   */
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  /**
   * This gets one user asynchronously.
   * @param id User Id.
   * @returns a promise with user object.
   */
  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0)
        throw new Error(`No such user ${id} exists.`);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user ${id}. Error: ${err}`);
    }
  }

  /**
   * This creates a new user.
   * @param user User object, email and password are required.
   * @returns a promise with newly created user object.
   */
  async create(user: User): Promise<User> {
    try {
      if (user.email === '' || user.password_digest === '')
        throw new Error('Email and password are required.');

      if (user.role === undefined) user.role = UserRole.Customer;

      const sql =
        'INSERT INTO users (password_digest, email, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(
        user.password_digest + BCRYPT_PASSWORD,
        SALT_ROUNDS
      );
      const result = await conn.query(sql, [
        hash,
        user.email,
        user.first_name,
        user.last_name,
        user.role,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add user ${user.email}. Error: ${err}`);
    }
  }

  /**
   * This autheticates a user, will check the email existence before authentication.
   * @param email the email of the user to be authenticated
   * @param password the plain password of the user to be authenticated.
   * @returns a promise with a custom object {isAuth: true, user: User} if passwords matched,
   * {isAuth: false, user: User} if passwords not matched, or Null if email not found
   */
  async authenticate(
    email: string,
    password: string
  ): Promise<null | { isAuth: boolean; user: User }> {
    try {
      if (email === '' || password === '')
        throw new Error('Email and password are required.');
      const conn = await Client.connect();
      const sql =
        'SELECT id, email, password_digest, role FROM users WHERE email = ($1)';
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length === 0) {
        return null;
      }
      const user = result.rows[0];
      return bcrypt.compareSync(
        password + BCRYPT_PASSWORD,
        user.password_digest
      )
        ? { isAuth: true, user: user }
        : { isAuth: false, user: user };
    } catch (err) {
      throw new Error(`Email ${email} not found.`);
    }
  }
}

export { User, UserRole, UserStore };
