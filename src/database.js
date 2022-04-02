import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "blog",
  connectionLimit: 5,
});

async function getNewestPosts() {
  let conn
  try {
    conn = await pool.getConnection();
    return await conn.query(
      'SELECT * FROM blog ORDER BY id DESC LIMIT 11'
    )
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function getTenPosts(before) {
  let conn
  try {
    conn = await pool.getConnection();
     return await conn.query(
      'SELECT * FROM blog WHERE id < ? ORDER BY id DESC LIMIT 11',
      [before]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}
async function addPost(post) {
  let conn
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `INSERT INTO blog (date,body) VALUES (?,?) RETURNING id`,
      [post.date, post.body]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}


async function updatePost(post) {
  let conn
  try {
    conn = await pool.getConnection();
    return await conn.query(
      `UPDATE blog SET body = ? WHERE id = ?`,
      [ post.body, post.id]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function deletePost(post) {
  let conn 
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      `DELETE from blog where id = ?`,
      [post.id]
    );
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

export { getNewestPosts, getTenPosts, addPost, deletePost, updatePost };
