import {Book} from '../models/index.js';

export const addBook = (req, res) => {
  const bookData = req.body;

  Book.create(bookData, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding book' });

    res.status(201).json({ message: 'Book added successfully' });
  });
};

export const searchBooks = (req, res) => {
  const searchCriteria = req.query;

  Book.search(searchCriteria, (err, books) => {
    if (err) return res.status(500).json({ message: 'Error searching books' });

    res.json(books);
  });
};
