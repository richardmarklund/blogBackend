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

async function getFirstPosts() {
  let conn
  try {
    conn = await pool.getConnection();
    return await conn.query(
      'SELECT * FROM blog ORDER BY id DESC LIMIT 10'
    )
    
     
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function getNextTenPosts(max) {
  let conn
  try {
    conn = await pool.getConnection();
     return await conn.query(
      'SELECT * FROM blog WHERE id < ? ORDER BY id DESC LIMIT 10',
      [max]
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
      `INSERT INTO blog (date,topic,body) VALUES (?,?,?) RETURNING id`,
      [post.date, post.topic, post.body]
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

export { getNextTenPosts, getFirstPosts, addPost, deletePost };
