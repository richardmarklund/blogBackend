import request from "supertest";
import assert from "assert";
import app from "./app.js";
import { addPost, deletePost } from "./database.js";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();
let token = null;

describe("post /login", function () {
  it("returns 200", async () => {
    const response = await request(app).post("/login").send({
      username: process.env.API_USERNAME,
      password: process.env.API_TEST_PASSWORD,
    });
    token = response.body;
    assert(response.status === 200);
  });
});

describe("get /getPosts", function () {
  it("returns 200", async () => {
    const response = await request(app).get("/getPosts");
    assert(response.status === 200);
  });
});

describe("get /getTenPosts", function () {
  it("returns 200", async () => {
    const max = 20;
    const response = await request(app)
      .get("/getTenPosts")
      .query({ before: 20 });
    assert(response.status === 200);
  });
});
describe("remove /remove", () => {
  before("add to be deleted", async () => {
    const id = await addPost({
      date: "2019-01-01",
      body: "testing",
    });
    describe("remove post", () => {
      it("returns 200", async () => {
        const response = await request(app)
          .delete("/delete")
          .set("Cookie", [`token=${token}`])
          .send({ id: id[0].id });
        assert(response.status === 200);
      });
    });
  });
  describe("remove post id null", () => {
    it("returns 500", async () => {
      const response = await request(app)
        .delete("/delete")
        .set("Cookie", [`token=${token}`])
        .send({ id: null });
      assert(response.status === 500);
    });
  });
});
  
  describe("put /post", () => {
    before("add to be edited", async () => {
      const id = await addPost({
        date: "2019-01-01",
        body: "testing123",
      });
      describe("edit post", () => {
        it("returns 200", async () => {
          const response = await request(app)
            .put("/post")
            .set("Cookie", [`token=${token}`])
            .send({ id: id[0].id, body: "edited" });
          assert(response.status === 200);

          deletePost({id: id})
        });
      });
    });

  describe("remove without body", () => {
    it("returns 500", async () => {
      const response = await request(app)
        .delete("/delete")
        .set("Cookie", [`token=${token}`]);
      assert(response.status === 500);
    });
  });
});

describe("post /post", () => {
  describe("send post correct", () => {
    it("returns 200", async () => {
      let response = await request(app)
        .post("/post")
        .set("Cookie", [`token=${token}`])
        .send({
          date: "2019-01-01",
          body: "testing",
        });
      assert(response.status === 200);
      let response2 = await deletePost({ id: response.text });
    });
  });

  describe("send empty post", () => {
    it("returns 500", async () => {
      let response = await request(app)
        .post("/post")
        .set("Cookie", [`token=${token}`])
        .send();
      assert(response.status === 500);
    });
  });
  describe("send post without date", () => {
    it("returns 500", async () => {
      let response = await request(app)
        .post("/post")
        .set("Cookie", [`token=${token}`])
        .send({
          body: "testing",
        });
      assert(response.status === 500);
    });
  });
});
