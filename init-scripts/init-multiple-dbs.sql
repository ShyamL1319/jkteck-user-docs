-- Check and create the user_docs_management database
SELECT 'CREATE DATABASE user_docs_management'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'user_docs_management'
)\gexec

-- unit testing gb
SELECT 'CREATE DATABASE user_docs_management_test'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'user_docs_management_test'
)\gexec

-- Check and create the ingestion_service database
SELECT 'CREATE DATABASE ingestion_service'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'ingestion_service'
)\gexec
-- Switch to the user_docs_management database (use \c in psql for interactive session)
-- \connect user_docs_management;

-- -- Create the "user" table if it doesn't exist
-- CREATE TABLE IF NOT EXISTS "user" (
--     "id" SERIAL PRIMARY KEY,
--     "name" TEXT NOT NULL,
--     "email" TEXT NOT NULL UNIQUE,
--     "password" TEXT NOT NULL,
--     "roles" TEXT[] NOT NULL,
--     "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
--     "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
-- );

-- -- Insert user data
-- INSERT INTO "user" (
--     "name",
--     "email",
--     "password",
--     "roles",
--     "createdAt",
--     "updatedAt"
-- )
-- VALUES (
--     'Shyam',
--     'shyam.lal@gmail.com',
--     '$2a$10$kLyRfldcsLf/NQt9RBiHFeR3E1lysjbiWLwksRDAzvzDMf02e2hUq',
--     ARRAY['admin'],
--     '2025-01-24 21:21:19.478',
--     '2025-01-24 21:21:19.478'
-- );