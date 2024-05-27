import express from "express";
import {
  register,
  login,
  getUser,
  verifyToken,
  getAllUsers,
  searchUsers,
} from "../controller/auth.controller.js";

const router = express.Router();

// Normal auth routes
router.get("/user", verifyToken, getUser);
router.get("/allUsers", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/users/search", searchUsers);

export default router;
