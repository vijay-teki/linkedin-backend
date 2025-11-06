import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleWare.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.patch("/me", protect, upload.single("profileImage"), updateProfile);

export default router;
