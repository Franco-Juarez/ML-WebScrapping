CREATE TABLE products (
	productId BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	name VARCHAR(255) NOT NULL,
	url TEXT NOT NULL,
	price DECIMAL(10, 2),
	freeShipping BOOLEAN NOT NULL
);


CREATE TABLE product_search (
	searchId BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	searchTerm VARCHAR(255) NOT NULL, 
	searchDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP	
);

CREATE TABLE product_search_results (
  searchId BINARY(16),
  productId BINARY(16),
  PRIMARY KEY (searchId, productId),
  FOREIGN KEY (searchId) REFERENCES product_search(searchId) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE
);