-- 10-table schema for Anonymous Polling Platform (PlanetScale compatible)
-- Note: PlanetScale (Vitess) does not enforce FOREIGN KEY constraints in some setups.
-- Use application logic to enforce referential integrity.

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin','voter') DEFAULT 'voter',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE elections (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME,
  end_time DATETIME,
  status VARCHAR(32) DEFAULT 'draft',
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (created_by)
);

CREATE TABLE candidates (
  id VARCHAR(36) PRIMARY KEY,
  election_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (election_id)
);

CREATE TABLE votes (
  id VARCHAR(36) PRIMARY KEY,
  election_id VARCHAR(36),
  user_id VARCHAR(36), -- stored for server-side validation but NOT exposed publicly
  candidate_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (election_id),
  INDEX (user_id),
  INDEX (candidate_id)
);

CREATE TABLE vote_receipts (
  id VARCHAR(36) PRIMARY KEY,
  vote_id VARCHAR(36),
  receipt_code VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (vote_id)
);

CREATE TABLE auctions (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME,
  end_time DATETIME,
  status VARCHAR(32) DEFAULT 'draft',
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (created_by)
);

CREATE TABLE bids (
  id VARCHAR(36) PRIMARY KEY,
  auction_id VARCHAR(36),
  user_id VARCHAR(36),
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (auction_id),
  INDEX (user_id)
);

CREATE TABLE captcha_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(255),
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
);

CREATE TABLE admin_logs (
  id VARCHAR(36) PRIMARY KEY,
  admin_id VARCHAR(36),
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (admin_id)
);

CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id)
);

-- Helpful notes:
-- 1) When using Prisma, generate migrations locally and use `prisma migrate deploy` in production.
-- 2) Use short, predictable connection pools on serverless hosts (Render) to avoid exhausting connections.
-- 3) For anonymous voting: do not expose `user_id` or `receipt_code` publicly; only reveal aggregate results.
