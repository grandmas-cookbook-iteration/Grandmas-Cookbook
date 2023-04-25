// Node-PostgreSQL package for connecting node server with PostgreSQL database
import { Pool, QueryResult } from 'pg';
require('dotenv').config();

const pool = new Pool({
  // Secret PostgreSQL database URI stored in local .env
  connectionString: process.env.DB_URI,
});

/*
It is a good practice to have id in the table, to provide a stable reference point (won't change if any data of the row is updated) for other tables.  

  CREATE TABLE recipes (
    id SERIAL PRIMARY KEY, 
    url VARCHAR(255),
    title VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR (255),
    ingredientList JSON,
    directions JSON,
    tastyId INTEGER,
    imagePath VARCHAR(255),
    userId INTEGER REFERENCES users (id)
  )
  
  Store the image in file system and store the path to image file in the image_path column of recipes table.
    OR
  Store the recipe's image (binary data itself) in separate table to keep the recipes table lean and efficient pg_read_binary_file('/path-to-image/')

  CREATE TABLE recipeImages (
    id SERIAL PRIMARY KEY,
    image BYTEA,
    recipeId INTEGER REFERENCES recipes (id)
  )

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )

  CREATE TABLE tasty_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
  )
  
  Join table for the many-to-many relationship between recipes and tasty_tags
  CREATE TABLE recipes_tasty_tags (
    id SERIAL PRIMARY KEY,
    recipeId INTEGER REFERENCES recipes (id),
    tagId INTEGER REFERENCES tasty_tags (id)
  )
 */

export const db = {
  query: async (text: string, params?: any[]): Promise<QueryResult<any>> => {
    console.log('executed query', text);
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Error in db query:', error)
      throw error;
    }
  }
};