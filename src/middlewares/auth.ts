import express, { Request, Response } from 'express';
import { User, UserRole } from '../models/user';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../database';

/**
 * This creates jwt authentication token.
 * @param user User object. Id, and email are required.
 * @returns the signed token or undefined if failed to sign.
 */
const createAuthToken = (user: User): string | undefined => {
  try {
    if (user.id === undefined) throw new Error('user ID is required.');
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      TOKEN_SECRET
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`jwt.sign failed: ${err.message}`);
    }
  }
};

/**
 * This middleware verifies the jwt token by checking below 4 different places, and give authorization to users.
 * Admin serves as super user, has ultimate authority. For regular users, the token user id needs to match the uid
 * in the request parameter to gain access.
 * 1) Authorization key in request headers which is formatted as 'Bearer <token>'
 * 2) x-access-token key in request headers
 * 3) token parameter in request query
 * 4) token key in request body
 * @param req http request.
 * @param res htpp response.
 * @param next express next function.
 */
const verifyAuthToken = (
  req: Request,
  res: Response,
  next: express.NextFunction
): void => {
  try {
    let token = '';
    const ary = [
      req.headers.authorization,
      req.headers['x-access-token'],
      req.body.token,
      req.query.token,
    ]; //handle all possible ways to get tokens.

    //The format for req.headers.authorization is 'Bearer <token>'. Need special string handling, see the i===0 case.
    for (let i = 0; i < ary.length; i++) {
      if (token.length !== 0) break;
      if (ary[i] === undefined) continue;
      token = i === 0 ? ary[i].split(' ')[1] : ary[i];
    }
    if (token.length === 0) throw new Error('Token is missing.');

    const decoded = jwt.verify(token, TOKEN_SECRET);
    const decodedUser = decoded as unknown as User;

    //Admin is the super user who can access any endpoints. Otherwise, end user can only access their own pages under /users/:uid/
    if (
      decodedUser.role === UserRole.Admin ||
      decodedUser.id === parseInt(req.params.uid)
    ) {
      next();
    } else {
      throw new Error('User not permitted.');
    }
  } catch (err) {
    res.status(401);
    res.send(err);
  }
};

export { createAuthToken, verifyAuthToken };
