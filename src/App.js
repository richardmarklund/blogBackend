import express from "express";
import { getAllPosts, addPost } from "./firebase.js";

const app = express();
const port = 3000;

app.get("/allPosts", (req, res) => {
  getAllPosts()
    .then((posts) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(posts));
    })
    .catch((e) => {
      console.log(e);
      res.status(500);
      res.render("error", { error: e });
    });
});

app.post("/post", (req, res) => {
  const body = req.body;
  addPost(body)
    .then((posts) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(posts));
    })
    .catch((e) => {
      console.log(e);
      res.status(500);
      res.render("error", { error: e });
    });
});

app.listen(port);
