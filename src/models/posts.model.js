import mongoose, { Schema } from "mongoose";

const postschema = new mongoose.Schema({
  description: String,

  author: String,

  filePath: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  likesCount: {
    type: [String],
    default: [],
  },

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String,
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ], // Updated comments to include user and timestamp

  views: {
    type: Number,
    default: 0,
  },

  friends: {
    type: Array,
    default: [],
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const Post = mongoose.model("Post", postschema);
