import { Book } from '../models/index.js';
import jwt from 'jsonwebtoken';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.id;
    next();
  });
};

export const addBook = [verifyToken, (req, res) => {
  const bookData = req.body;

  Book.create(bookData, req.userId, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: err.message??'Error adding book' });}

    res.status(201).json({ message: 'Book added successfully' });
  });
}];

// Controller to search for books with user information and pagination
export const searchBooks = [verifyToken, (req, res) => {
  const searchCriteria = req.query;

  Book.search(searchCriteria, (err, result) => {
    if (err) {
      console.log(err);  
      return res.status(500).json({ message: 'Error searching books' });
    }

    res.json({
      books: result.books,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalBooks: result.totalBooks,
    });
  });
}];
