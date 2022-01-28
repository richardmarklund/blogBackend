import express from "express";
import { getAllPosts, addPost } from "./src/dynamodb.js";

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send("helloWorld");
});

app.post("/post", (req, res) => {
  const body = req.body;
  addPost(body)
    .then(() => {
      res.setHeader("Content-Type", "application/json");
      res.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      res.status(500);
      res.render("error", { error: e });
    });
});

app.listen(port, ()=>{console.log('test')});
