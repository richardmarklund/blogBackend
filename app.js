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
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

const options = {
  origin: 'http://192.168.1.2:3000'
};
app.use(cors(options));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/getFirstPosts", async (req, res) => {
  try {
    var posts = _.difference(await getFirstPosts(), ["meta"]);
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
    var posts = _.difference(await getNextTenPosts(max), ["meta"]);
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
      var id = _.difference(post, ["meta"])[0].id;
      res
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(id));
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
      deletePost(body);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.post("/image", upload.single("image"), function (req, res, next) {
  const file = req.file;

  if (!file) {
    const error = new Error("Please upload a file");
    res.status(400).send(error);
  }
  const filename = req.file.filename;
  res
    .setHeader("Content-Type", "application/json")
    .send(JSON.stringify(filename));
});

app.get("/image/:imageId", (req, res) => {
  res.sendFile(req.params.imageId,{root: `/uploads/`});

});

app.listen(port);
export default app;
