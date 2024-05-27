import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Register new user
const register = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = await User.create({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      username,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      console.error(err, "user not created");
      res.status(400).json({ message: "Failed to create user" });
    }

    return res.status(200).json({
      status: 200,
      data: newUser,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const loggedInUser = await User.findById(user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.cookie(String(user._id), token, {
      path: "/",
      expiresIn: new Date(Date.now() + 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "success",
      user: loggedInUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while login:" });
  }
};

// verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(404).json({ message: "no token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" });
    }
    req.id = user.id;
    next(); // Ensure next() is called after setting req.id
  });
};

// get user
const getUser = async (req, res) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    // const { _id } = req.params;
    const users = await User.find({});

    if (!users) {
      res.status(404).json({ message: "users not found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search for users by first name, last name, or username
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, verifyToken, getUser, getAllUsers, searchUsers };
