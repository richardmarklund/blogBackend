import admin from "firebase-admin";
import moment from "moment"
import { readFile } from 'fs/promises';


const serviceAccount = JSON.parse(await readFile(new URL('../serviceAccountKey.json', import.meta.url)));



 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();



// Get a list of cities from your database
async function getAllPosts() {
  const postCollection = await db.collection( 'blogs').get();
    const postList = postCollection.docs.map(doc => doc.data());
  return postList;
}

async function addPost(post) {
    await db.collection( 'blogs').doc().set(post);
}


export {getAllPosts,addPost}