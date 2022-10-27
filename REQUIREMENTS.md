# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index
  - GET /products
- Show
  - GET /products/<product_id>
- Create [token required]
  - POST /products
- Products by category (args: product category)
  - GET /products?category=<category name>
- Create batch products
  - POST /products/multiple 
- Top 5 most popular products 
  - GET /dashboard/top_popular_products
- Top 5 most expensive products 
  - GET /dashboard/top_expensive_products
- Products that are included in the orders
  - GET /dashboard/products_in_orders


#### Users
- Index [token required]
  - GET /users
- Show [token required]
  - GET /users/<user_id>
- Create N[token required] 
  - POST /users
- Authenticate
  - POST /users/authenticate
- Users that have orders
  - GET /dashboard/users_with_orders
  
#### Orders
- Current Order by user (args: user id)[token required]
  - GET /users/<user_id>/orders?status=active
- Completed Orders by user (args: user id)[token required]
  - GET /users/<user_id>/orders?status=complete
- Create Order for a user
  - POST /users/<user_id>/orders
- Update Order Status
  - PUT /users/<user_id>/orders/<order_id>
- Add products to an order
  - POST /users/<user_id>/orders/<order_id>/products
- Show products in an order
  - GET /users/<user_id>/orders/<order_id>/products

## Data Shapes
#### Product
-  id
- name
- price
- category

#### User
- id
- firstName
- lastName
- password
- email
- role

#### Orders
- id
- user_id
- status of order (active or complete)
- array of products in the order
  - id of each product
  - name of each product
  - price of eacg product
  - quantity of each product
  
  
## Database Schemas
#### users
- id SERIAL PRIMARY KEY,
- email VARCHAR(150) NOT NULL,
- password_digest VARCHAR(200) NOT NULL,
- first_name VARCHAR(100),
- last_name VARCHAR(100),
- role VARCHAR(20)

#### products
- id SERIAL PRIMARY KEY,
- name VARCHAR(64) NOT NULL,
- price DECIMAL(10,2) NOT NULL,
- category VARCHAR(64)
  
#### orders
- id SERIAL PRIMARY  KEY,
- status VARCHAR(64),
- user_id bigint REFERENCES users(id)

#### order_products
- id SERIAL PRIMARY KEY,
- quantity integer,
- order_id bigint REFERENCES orders(id),
- product_id bigint REFERENCES products(id)
