import {tables, db} from './index.js'

export async function createTables(){
    const queries=[
        //Users table
        `CREATE TABLE IF NOT EXISTS ${tables.users} (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
        );`,

        `CREATE TABLE IF NOT EXISTS ${tables.books} (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        published_date DATE,
        description TEXT,
        isbn VARCHAR(13) UNIQUE,
        availability BOOLEAN DEFAULT TRUE,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
        );`,

        `CREATE TABLE IF NOT EXISTS ${tables.userBooks} (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        book_id INT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
        primary key(id),
        FOREIGN KEY (user_id) REFERENCES ${tables.users}(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES ${tables.books}(id) ON DELETE CASCADE
        );`
    ]

    const conn= db.promise();

    try{
        for(let i in queries){
            await conn.query(queries[i])
        }
        console.log("::::Installed successfully")
    }catch(err){
        console.error("::::Error", err);
        await conn.query(`DROP TABLE IF EXISTS ${tables.userBooks}`);
        await conn.query(`DROP TABLE IF EXISTS ${tables.books}`);
        await conn.query(`DROP TABLE IF EXISTS ${tables.users}`);
    }
    finally{
        conn.end()
    }
}

export async function dropTables(){
    const conn= db.promise();
    await conn.query(`DROP TABLE IF EXISTS ${tables.userBooks}`);
    await conn.query(`DROP TABLE IF EXISTS ${tables.books}`);
    await conn.query(`DROP TABLE IF EXISTS ${tables.users}`);
    await conn.end();

    console.log("::::Uninstalled");
}