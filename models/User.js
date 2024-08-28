import {db, tables} from '../config/index.js';

export const User = {
  table: tables.users,

  create(userData, callback){
    const { username, email, password } = userData;
    const sql = `INSERT INTO ${this.table} (username, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, email, password], callback);
  },

  findByEmail(email, callback){
    const sql = `SELECT * FROM ${this.table} WHERE email = ?`;
    db.query(sql, [email], callback);
  },

  findById(id, callback){
    const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};