# Udacity---storefront-backend
 
A backend RESTful api for an ecommerce website. It's built to fulfill the requirement collected from stakeholders and front end dev team. See requirement for the api endpoint, data shapes, and database schema. This readme contains only setup and testing instruction.

Note: the project was done in windows environment. Some scripts might need to be modified before testing if you are running on mac or other os.

## Setup Instruction
1. Download this git to your local machine.
2. Create .env in the root folder. Below is what's originally used in the project. Database name needs to be the same, they are used in jasmine test script.
   - POSTGRES_HOST=localhost
POSTGRES_DB=phl_store
POSTGRES_TEST_DB=phl_store_test
POSTGRES_USER=phl
POSTGRES_PASSWORD=phl1234
ENV=dev
BCRYPT_PASSWORD=All-g00d-sunscr33n
SALT_ROUNDS=10
TOKEN_SECRET=SoCa1-Vi6e-WooH00

3. Make sure you have docker desktop installed on your machine. Run `docker-compose up` to start and set up postgresql image (port:5432).
4. Go to your postgres terminal, run `su postgres` then `psql -d phl_store -U phl` to make sure you are able to connect to phl_store database.
5. Back to the project terminal, run `npm run devup` to set up table schemas. (In postgres terminal, run `\dt` to confirm the setup)
6. Run `npm install` to confirm all packages are installed and up to date.
6. Now, you should be able to start testing by running `npm run watch`.
7. If you'd like to check jasmine unit testing, please run `npm run test`. This will set up test enviroment for jasmine.
8. Feel free to run `npm run lint` to make sure all codes are written error free. 

## Testing Instruction
All testing is done in Postman. Please install before starting testing. This web api server is running on localhost:3000.
### Test User Endpoint
Note: User can have Admin or Customer role. Admin user is the super user and can access any endpoint. Customer user can only access his own info.
- Index [token required]: **GET /users**
- Show [token required]: **GET /users/<user_id>**
- Create [token required]: **POST /users**

#### Create new users
1. On Postman, POST localhost:3000/users/ and in Body tab, select raw and JSON format and add the following. If no role is specified, it defaults to Customer role.
   - `{
  "email": "<your own choice>",
  "password": "<your own choice>",
  "first_name": "<optional>",
  "last_name": "<optional>",
  "role": "<optional, customer|admin, defatul customer>"
}`
2. Once request is sent, you should get an auth toke, user id, and email in the following format.
   - `{
    "token": <string>, 
    "id": <number>,
    "email": <string>,
    "role": <string>
}`
3. Please take a note on the token you receive. If lost, you can `POST /users/authenticate` with `{email,password}` body to retrieve the token.
4. Create at least one admin and two customer users for later testing authentication/authorization.

#### Get all users
1. GET localhost:3000/users/ and in Headers tab, type Authorization in KEY, and type `Bearer <token>` in VALUE. <token> is the admin user's token.
2. Now you should be able to view all users.
3. Repeat #1 and change token to customer's token. Customer role won't be able to view anything.
4. The JSON format for one user is `{"id": <number>,
        "email": <string>,
        "password_digest": <encrypted password>,
        "first_name": <string>,
        "last_name": <string>,
        "role": <customer|admin>}`

#### Get one user
1. GET localhost:3000/users/<user_id> and use admin token. Admin should be able to view every user info.
2. Test with customer token, customer user can only access their own user info.
3. The JSON format for one user is `{"id": <number>,
        "email": <string>,
        "password_digest": <encrypted password>,
        "first_name": <string>,
        "last_name": <string>,
        "role": <customer|admin>}` 

### Test Product Endpoint
- Index
- Show
- Create [token required]
- Products by category (args: product category)
### Test Order Endpoint
- Current Order by user (args: user id)[token required]
- Completed Orders by user (args: user id)[token required]
### Test Dashboard Endpoint
- Top 5 most popular products
- Top 5 expensive products
- Users that have placed orders

