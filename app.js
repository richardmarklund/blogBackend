import express from "express";
import {
  getNextTenPosts,
  getFirstPosts,
  addPost,
  deletePost,
} from "./src/database.js";
import cors from "cors";
import bp from "body-parser";
import _ from "lodash";

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false
}));

const port = process.env.PORT || 3000;

app.get("/getFirstPosts", async (req, res) => {
  try {
    var posts = _.difference(await getFirstPosts(), ['meta'])
    res
    .setHeader("Content-Type", "application/json")
    .send(JSON.stringify(posts));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/getTenPostsAfter", async (req, res) => {
  try {
    const max = req.query.max;
    var posts = _.difference(await getNextTenPosts(max), ['meta'])
    res
      .setHeader("Content-Type", "application/json")
      .send(JSON.stringify(posts));
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post("/post", async (req, res) => {
  const body = req.body;
  if (!body.date || !body.topic) {
    res.status(500).send("post id not found");
  } else {
    try {
      var post = await addPost(body);
      var id = _.difference(post, ['meta'])[0].id;
      res.setHeader("Content-Type", "application/json").send(JSON.stringify(id));
    } catch (err) {
      console.log(err);
    }
  }
});

app.delete("/delete", (req, res) => {
  const body = req.body;
  if (!body.id) {
    res.status(500).send("post id not found");
  } else {
    try {
      deletePost(body)
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.listen(port);
export default app;
