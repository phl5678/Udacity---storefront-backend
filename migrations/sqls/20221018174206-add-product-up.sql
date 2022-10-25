CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(64)
)