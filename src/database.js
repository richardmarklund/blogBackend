const { Client } = require('pg')
const client = new Client({connectionString: process.env.DATABASE_URL})



 async function getAllPosts() {
  await client.connect()
  const res = await client.query('SELECT * FROM public."blogPost"')
   await client.end()
   return res.rows;
  
}
async function addPost(post) {
  await client.connect()
  const res = await client.query(`INSERT INTO public."blogPost" (date,topic,body) VALUES ('${post.date}','${post.topic}','${post.body}')`)
   await client.end()
   return res;
}
export { getAllPosts, addPost };
