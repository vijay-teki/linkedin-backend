import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    let mediaData = null;
    if (req.file) {
      // multer-storage-cloudinary already uploaded; req.file.path or req.file.path may be used
      // multer-storage-cloudinary exposes req.file.path as the URL and req.file.filename as public_id
      mediaData = {
        url: req.file.path,
        public_id: req.file.filename,
        type: req.file.mimetype ? (req.file.mimetype.startsWith("video") ? "video" : (req.file.mimetype.startsWith("image") ? "image" : "raw")) : "raw"
      };
    }

    const post = await Post.create({
      author: req.user.id,
      text: req.body.text || "",
      media: mediaData
    });
    const populated = await post.populate("author", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name profileImage").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    if (post.media && post.media.public_id) {
      await cloudinary.uploader.destroy(post.media.public_id, { resource_type: "auto" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    if (req.body.text) post.text = req.body.text;

    if (req.file) {
      // remove old
      if (post.media && post.media.public_id) {
        await cloudinary.uploader.destroy(post.media.public_id, { resource_type: "auto" });
      }
      post.media = {
        url: req.file.path,
        public_id: req.file.filename,
        type: req.file.mimetype ? (req.file.mimetype.startsWith("video") ? "video" : (req.file.mimetype.startsWith("image") ? "image" : "raw")) : "raw"
      };
    }

    const updated = await post.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
