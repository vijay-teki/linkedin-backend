import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  media: {
    url: { type: String },
    public_id: { type: String },
    type: { type: String } // 'image' or 'video' or 'raw'
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
