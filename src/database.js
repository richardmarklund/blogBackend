import Client from "pg/lib/client.js";
import dotenv from "dotenv";

dotenv.config();

async function getAllPosts() {
  const client = new Client({ connectionString: process.env.DATABASEURL });
  await client.connect();
  const res = await client.query('SELECT * FROM public."blogPost"');
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

export { getAllPosts, addPost };
