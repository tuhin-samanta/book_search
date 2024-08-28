import {config as dotenvConfig} from 'dotenv';
import mysql from 'mysql2'
dotenvConfig()

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

export const tables= {
  users: 'users',
  books: 'books',
  userBooks: 'user_books'
}