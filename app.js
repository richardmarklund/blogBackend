import express from "express";
import { getAllPosts, addPost, deletePost } from "./src/database.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/allPosts", (req, res) => {
  try {
    getAllPosts()
      .then((posts) => {
        res
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(posts));
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/post", (req, res) => {
  const body = req.body;
  try {
    addPost(body)
      .then(() => {
        res.setHeader("Content-Type", "application/json").sendStatus(200);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", (req, res) => {
  const body = req.body;
  try {
    deletePost(body)
      .then(() => {
        res.setHeader("Content-Type", "application/json").sendStatus(200);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send(e);
      });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port);
