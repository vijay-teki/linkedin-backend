import express from "express";
import { createPost, getPosts, deletePost, updatePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleWare.js";

const router = express.Router();

router.post("/", protect, upload.single("media"), createPost);
router.get("/", getPosts);
router.put("/:id", protect, upload.single("media"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;
