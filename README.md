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
3. Please take a note on the token you receive. If lost, you can `POST /users/authenticate` with `{email, password}` body to retrieve the token.
4. Create at least one admin and two customer users for later testing authentication/authorization.

#### Get all users
1. GET localhost:3000/users/ with admin user's token.
   - In Headers tab, type `Authorization` in KEY, and type `Bearer <token>` in VALUE. <token> is the auth token.
   - There are 3 other ways to apply the token.
     1. Place the token as `{"token": <token> }` JSON in the request body 
     2. In query parameter `localhost:3000/users?token=<token>`
     3. In Headers tab, use `x-access-token` in KEY and type `<token>` in VALUE. 
2. Admin user should be able to view all users.
3. Repeat #1 and change token to customer's token. Customer role shouldn't be able to view anything.
4. The format of the JSON response is an array of `{"id": <number>,
        "email": <string>,
        "password_digest": <encrypted password>,
        "first_name": <string>,
        "last_name": <string>,
        "role": <customer|admin>}`

#### Get one user
1. GET localhost:3000/users/<user_id> with admin token. Admin should be able to view every user info.
2. Repeat with customer token, customer user should only access their own user info.
3. The format of the JSON response is `{"id": <number>,
        "email": <string>,
        "password_digest": <encrypted password>,
        "first_name": <string>,
        "last_name": <string>,
        "role": <customer|admin>}` 

### Test Product Endpoint
- Index: **GET /products**
- Show: **GET /products/<product_id>**
- Create [token required]: **POST /products**
- Products by category: **GET /products?category=<category name>**

#### Create a product
1. POST localhost:3000/products with the following JSON in the request body, and with admin user's token.
   - `{"name": <string>, "price": <number>, "category": <string> }`
2. Admin user should be able to create a new product.
3. The format of the JSON response is `{"id": <number>, "name": <string>, "price": <string>, "category": <string>}` 
4. Repeat with customer token or without token and verify product is not created.
 
#### Get all products / get a list of products in certain category 
1. GET localhost:3000/products and you should be able to view all products
2. GET localhost:3000/products?category=<category> and you should be able to view a list of products in certain catogery.
   - To create batch products, POST to localhost:3000/products/multiple with the following JSON request body and admin token.
   - `{"products" : <array of {"name": <string>, "price": <number>, "category": <string> } >}`

#### Get one product
1. GET localhost:3000/products/<product_id> and you should be able to view the product.
2. If no such product exists, it should return empty JSON.
 
### Test Order Endpoint
- Current Order by user [token required]: **GET /users/<user_id>/orders?status=active**
- Completed Orders by user [token required] **GET /users/<user_id>/orders?status=complete**

#### Get current order by user
1. First, create order for a user. POST localhost:3000/users/<user_id>/orders with admin token or the user's own token, and provide the following JSON in request body.
   - `{"status": <optional, active|complete, default active>}`
2. Take note on the returned order ID. Now, add prodcuts to the order by POST localhost:3000/users/<user_id>/orders/<order_id>/products with the following JSON in request body. Again please use admin token or the user's own token.
   - `{"quantity": <number>, "product_id": <number>}`
3. Repeat to add more products to this order for the user.
   = Note users won't be able to add products to any completed order. Make sure you leave status empty or set it to "active".
4. Now, to get current order by user, GET localhost:3000/users/<user_id>/orders?status=active. You should be able to view all active orders. Note the plural, this will return array of order info if there are more than one active order for this user.
5. The format of the JSON response is `{"order_id": <number>,
        "order_status": <active|complete>,
        "user_id": <string>,
        "products": <array of
            {
                "product_id": <string>,
                "product_name": <string>,
                "product_price": <string>,
                "quantity": <number>
            }>}`
6. You can also view a particular order by GET localhost:3000/users/<user_id>/orders/<order_id>/products with admin token or the user's own token. The JSON response is the same.

#### Get completed orders by user
1. Similar to above get current order by user. Repeat step 1 to 3 to add more active orders
   - Make sure to create active order. Otherwise no products can be added to a completed order.
2. Pick few orders and update their status to "complete" by **PUT localhost:3000/users/<user_id>/orders/<order_id>/** with `{"status": <active|complete>}` JSON in request body and provide admin token or user's own token.
3. Now, you can test the get completed orders by user by GET localhost:3000/users/<user_id>/orders?status=complete. You should be able to view all completed orders.
4. The JSON response format is same as above. 

### Test Dashboard Endpoint
- Top 5 most popular products: GET /dashboard/top_popular_products
- Top 5 expensive products: GET /dashboard/top_expensive_products
- Products that are included in the orders: GET /dashboard/products_in_orders
- Users that have placed orders: GET /dashboard/users_with_orders

#### Get top 5 most popular products
1. GET localhost:3000/dashboard/top_popular_products to view top 5 most popular products. 
2. You can also view top 3, or top 10 by adding limit query parameter. GET localhost:3000/dashboard/top_popular_products?limit=<number>
3. The response should include product id, name, price, and total orders count in the JSON format. See below.
   - `{"id": <number>,
        "name": <string>,
        "price": <string>,
        "total_orders": <string>}`

#### Get top 5 most expensive products
1. GET localhost:3000/dashboard/top_expensive_products to view top 5 most expensive products. 
2. You can also view top 3, or top 10 by adding limit query parameter. GET localhost:3000/dashboard/top_expensive_products?limit=<number>
3. The response should included product id, name, price, and total orders count in the JSON format. See below.
   - `{"id": <number>,
        "name": <string>,
        "price": <string>}`
 

#### Products that are included in the orders
1. GET localhost:3000/dashboard/products_in_orders
2. The response should include product id, name, price, and order id
 
#### Users that have placed orders
1. GET localhost:3000/dashboard/users_with_orders
2. The response should include user id, email, and total orders count.

