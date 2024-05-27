import express from "express";
import auth from "../middleware/auth.js";

import {
  comment,
  createPost,
  deletePost,
  getAllPosts,
  getPostComments,
  getUserPosts,
  likePost,
} from "../controller/posts.controller.js";

const router = express.Router();

router.get("/getAllPosts", getAllPosts);
router.get("/getPost", auth, getUserPosts);
router.post("/createPost", auth, createPost);
router.delete("/deletePost/:id", auth, deletePost);
router.patch("/:id/like", auth, likePost);
router.post("/:id/comments", comment);
router.get("/:id/postComments", getPostComments);

export default router;
