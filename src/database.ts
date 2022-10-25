import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  BCRYPT_PASSWORD,
} = process.env;

const ENV: string =
  process.env.ENV === undefined ? 'dev' : process.env.ENV.trim(); //Windows "set ENV=test " has a trailing space.
const SALT_ROUNDS: number =
  process.env.SALT_ROUNDS === undefined
    ? 10
    : parseInt(process.env.SALT_ROUNDS);
const TOKEN_SECRET: string =
  process.env.TOKEN_SECRET === undefined ? '' : process.env.TOKEN_SECRET;

const Client =
  ENV === 'test'
    ? new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
      })
    : new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
      });

export { Client as default, BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET };
