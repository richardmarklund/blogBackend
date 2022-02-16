import express from "express";
import {
  getNextTenPosts,
  getFirstPosts,
  addPost,
  deletePost,
} from "./src/database.js";
import cors from "cors";
import bp from "body-parser";

const app = express();
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/getFirstPosts", (req, res) => {
  try {
    getFirstPosts()
      .then((posts) => {
        res
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(posts));
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  } catch (err) {
    console.log(err);
  }
});

app.get("/getTenPostsAfter", (req, res) => {
  try {
    const max = req.query.max;
    getNextTenPosts(max)
      .then((posts) => {
        res
          .setHeader("Content-Type", "application/json")
          .send(JSON.stringify(posts));
      })
      .catch((e) => {
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
      .then((id) => {
        res.setHeader("Content-Type", "application/json").send(JSON.stringify(id));
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete", (req, res) => {
  const body = req.body;
  if (!body.id) {
    res.status(500).send("post id not found");
  } else {
    try {
      deletePost(body)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((e) => {
          res.status(500).send(e);
        });
    } catch (err) {
      console.log(err);
    }
  }
});

app.listen(port);
export default app;
