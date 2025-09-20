
-- This file is used to initialize the database when using Docker Compose
-- It creates the database and user if they don't exist

-- The database and user are already created by the environment variables
-- This file ensures any additional setup is done

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';
