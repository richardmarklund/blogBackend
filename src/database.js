import Client from "pg/lib/client.js";
import dotenv from "dotenv";

dotenv.config();

async function getTop10Posts() {
  const client = new Client({ connectionString: process.env.DATABASEURL });
  await client.connect();
  const res = await client.query('SELECT * FROM public."blogPost" ORDER BY id DESC LIMIT 10');
  await client.end();
  return res.rows;
}
async function addPost(post) {
  const client = new Client({ connectionString: process.env.DATABASEURL });
  await client.connect();
  const res = await client.query(
    `INSERT INTO public."blogPost" (date,topic,body) VALUES ('${post.date}','${post.topic}','${post.body}')`
  );
  await client.end();
  return res;
}

async function deletePost(post) {
  const client = new Client({ connectionString: process.env.DATABASEURL });
  await client.connect();
  const res = await client.query(
    `DELETE from public."blogPost" where id = ${post.id}`
  );
  await client.end();
  return res;
}

export { getTop10Posts, addPost, deletePost };
