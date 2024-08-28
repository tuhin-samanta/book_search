import { db, tables } from '../config/index.js';

export const Book = {
  booksTable: tables.books,
  usersTable: tables.users,
  userBooksTable: tables.userBooks,

  // Method to create a new book and associate it with a user
  create(bookData, userId, callback) {
    const { title, author, genre, published_date, description, isbn, availability } = bookData;

    // Start transaction to ensure both operations succeed together
    db.beginTransaction((err) => {
      if (err) return callback(err);

      // Check if ISBN already exists
      const sqlCheckISBN = `SELECT COUNT(*) as count FROM ${this.booksTable} WHERE isbn = ?`;
      db.query(sqlCheckISBN, [isbn], (err, result) => {
        if (err) {
          return db.rollback(() => callback(err));
        }

        if (result[0].count > 0) {
          // ISBN already exists, rollback transaction
          return db.rollback(() => callback({ message: 'ISBN already exists', status: 400 }));
        }

        // If ISBN is unique, proceed with inserting the book
        const sqlInsertBook = `INSERT INTO ${this.booksTable} (title, author, genre, published_date, description, isbn, availability) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sqlInsertBook, [title, author, genre, published_date, description, isbn, availability], (err, result) => {
          if (err) {
            return db.rollback(() => callback(err));
          }

          const bookId = result.insertId;

          const sqlInsertUserBook = `INSERT INTO ${this.userBooksTable} (user_id, book_id) VALUES (?, ?)`;
          db.query(sqlInsertUserBook, [userId, bookId], (err, result) => {
            if (err) {
              return db.rollback(() => callback(err));
            }

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => callback(err));
              }
              callback(null, { bookId, userId });
            });
          });
        });
      });
    });
  },

  // Method to search for books with additional user information
  search(searchCriteria, callback) {
    let sql = `
      SELECT b.*, u.username AS added_by_name, u.email AS added_by_email 
      FROM ${this.booksTable} b
      LEFT JOIN ${this.userBooksTable} ub ON b.id = ub.book_id
      LEFT JOIN ${this.usersTable} u ON ub.user_id = u.id
      WHERE 1=1`;

    const params = [];
    
    if(searchCriteria.page){
      searchCriteria.page= parseInt(searchCriteria.page);
    }

    // Adding search filters
    if (searchCriteria.title) {
      sql += ' AND b.title LIKE ?';
      params.push(`%${searchCriteria.title}%`);
    }

    if (searchCriteria.author) {
      sql += ' AND b.author LIKE ?';
      params.push(`%${searchCriteria.author}%`);
    }

    if (searchCriteria.genre) {
      sql += ' AND b.genre = ?';
      params.push(searchCriteria.genre);
    }

    if (searchCriteria.published_date_start && searchCriteria.published_date_end) {
      sql += ' AND b.published_date BETWEEN ? AND ?';
      params.push(searchCriteria.published_date_start, searchCriteria.published_date_end);
    }

    // Count total matching books
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as count_query`;

    db.query(countSql, params, (err, countResult) => {
      if (err) return callback(err);

      const totalBooks = countResult[0].total;
      const limit = searchCriteria.page_size || 10;  // Default limit is 10
      const totalPages = Math.ceil(totalBooks / limit);
      const offset = (searchCriteria.page ? searchCriteria.page - 1 : 0) * limit;

      // Add sorting and pagination
      if (searchCriteria.sort_by) {
        const sortOrder = searchCriteria.sort_order === 'desc' ? 'DESC' : 'ASC';
        sql += ` ORDER BY b.${db.escapeId(searchCriteria.sort_by)} ${sortOrder}`;
      }
      sql += ' LIMIT ?, ?';
      params.push(parseInt(offset), parseInt(limit));

      db.query(sql, params, (err, books) => {
        if (err) return callback(err);

        callback(null, {
          books,
          totalPages,
          currentPage: searchCriteria.page || 1,
          totalBooks,
        });
      });
    });
  }
};
