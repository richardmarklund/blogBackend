import express from "express";
import { getAllPosts, addPost, deletePost } from "./src/database.js";
import cors from "cors";

const app = express();
var corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
};

const port = process.env.PORT || 3000;

app.get("/allPosts", cors(corsOptions), (req, res) => {
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

app.post("/post", cors(corsOptions), (req, res) => {
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

app.delete("/delete", cors(corsOptions), (req, res) => {
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
