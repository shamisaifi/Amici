import { Post } from "../models/posts.model.js";

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.userId,
    });

    res
      .status(200)
      .json({ status: 200, posts, message: "posts get successfully" });
  } catch (error) {
    res.json({ error: error, message: "error while getting  the posts" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allposts = await Post.find({}).populate("user");

    res.status(200).json({ allposts });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { description, filePath } = req.body;

    const post = await Post.create({
      description,
      filePath,
      user: req.userId,
      createdAt: new Date().toISOString(),
    });

    res
      .status(200)
      .json({ status: 200, post, message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = req.body;

    if (!id) {
      res.json("no such post was found");
      return;
    }

    const deletedPost = await Post.findByIdAndDelete(id, { post });

    if (!deletedPost) {
      return res.json({
        message: "failed to delete the post/post not found with this is",
      });
    }
    // console.log(deletePost);

    res.status(200).json({
      message: "post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    const index = post.likesCount.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likesCount.push(req.userId);
    } else {
      post.likesCount = post.likesCount.filter((id) => id !== req.userId);
    }

    const likedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    if (!likedPost) {
      return res.json({ message: "post not liked" });
    }

    console.log("like: ", likedPost);

    res.status(200).json({ data: likedPost, message: "post liked" });
  } catch (error) {
    console.log(error);
  }
};

const comment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, comments } = req.body; // Added 'user' to destructuring assignment
    const post = await Post.findById(id);

    if (!post.comments) {
      post.comments = []; // Initialize comments array if it doesn't exist
    }

    post.comments.push({ user, comment: comments }); // Added 'user' to the comment object

    const commentedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(commentedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" }); // Added response in case of error
  }
};

const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("comments.user");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);
  } catch (error) {
    console.log(error);
  }
};

export {
  getUserPosts,
  createPost,
  deletePost,
  likePost,
  getAllPosts,
  comment,
  getPostComments,
};
