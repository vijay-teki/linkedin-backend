import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;

    if (req.file) {
      if (user.profileImage && user.profileImage.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }
      // note: multer-storage-cloudinary sets req.file.path and req.file.filename
      user.profileImage = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updated = await user.save();
    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      profileImage: updated.profileImage.url
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
