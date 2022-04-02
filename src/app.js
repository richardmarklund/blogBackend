import express from "express";
import {
  getNewestPosts,
  getTenPosts,
  addPost,
  deletePost,
} from "./database.js";
import dotenv from "dotenv";
import cors from "cors";
import bp from "body-parser";
import _ from "lodash";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { verifyToken } from './auth.js'
import cookieParser from 'cookie-parser';


dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const getNextPage = (posts, path) => {
  if (posts.length > 10) {
    const maxId = posts.slice(0, 10)[9].id;
    return `http://192.168.1.2:3001/getTenPosts?before=${maxId}`;
  } else {
    return null;
  }
};

const app = express();

const options = {
  origin: ["http://192.168.1.2:3000", "http://localhost:3000"],
  credentials: true
};

app.use(cookieParser());
app.use(cors(options));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const port = process.env.PORT || 3001;

app.get("/getPosts", async (req, res) => {
  try {
    var posts = _.difference(await getNewestPosts(), ["meta"]);
    res.setHeader("Content-Type", "application/json").send(
      JSON.stringify({
        next: getNextPage(posts),
        data: posts.slice(0, 10),
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/getTenPosts", async (req, res) => {
  try {
    const before = req.query.before;
    var posts = _.difference(await getTenPosts(before), ["meta"]);
    res.setHeader("Content-Type", "application/json").send(
      JSON.stringify({
        next: getNextPage(posts),
        data: posts.slice(0, 10),
      })
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/post",verifyToken, async (req, res) => {
  const body = req.body;
  if (!body.date) {
    res.status(500).send("date not found");
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

app.delete("/delete",verifyToken, (req, res) => {
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

app.post("/image",verifyToken, upload.single("image"), (req, res) => {
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
  res.sendFile(req.params.imageId, { root: `/uploads/` });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    res.status(400).send("All input is required");
  }
  
  const savedUsername = process.env.API_USERNAME;
  const savedPassword = process.env.API_PASSWORD;

  if (savedUsername&&savedPassword && (await bcrypt.compare(password,savedPassword) && username === savedUsername)) {
    const token = jwt.sign(
      { user_id: 1, username: username },
      process.env.API_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).json(token);
  } else {
    res.status(400).send("Invalid Credentials");
  }
})

app.listen(port);
export default app;
