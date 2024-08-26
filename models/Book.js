import db from '../config';

const Book = {
  table: 'books',

  create(bookData, callback){
    const { title, author, genre, published_date, description, isbn, availability } = bookData;
    const sql = `INSERT INTO ${this.table} (title, author, genre, published_date, description, isbn, availability) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, author, genre, published_date, description, isbn, availability], callback);
  },

  search(searchCriteria, callback){
    let sql = `SELECT * FROM ${this.table}`;
    const params = [];

    if (searchCriteria.title) {
      sql += ' AND title LIKE ?';
      params.push(`%${searchCriteria.title}%`);
    }

    if (searchCriteria.author) {
      sql += ' AND author LIKE ?';
      params.push(`%${searchCriteria.author}%`);
    }

    if (searchCriteria.genre) {
      sql += ' AND genre = ?';
      params.push(searchCriteria.genre);
    }

    if (searchCriteria.published_date_start && searchCriteria.published_date_end) {
      sql += ' AND published_date BETWEEN ? AND ?';
      params.push(searchCriteria.published_date_start, searchCriteria.published_date_end);
    }

    if (searchCriteria.sort_by) {
      sql += ` ORDER BY ${searchCriteria.sort_by}`;
    }

    if (searchCriteria.page && searchCriteria.page_size) {
      sql += ' LIMIT ?, ?';
      params.push((searchCriteria.page - 1) * searchCriteria.page_size, searchCriteria.page_size);
    }

    db.query(sql, params, callback);
  }
};

module.exports = Book;
