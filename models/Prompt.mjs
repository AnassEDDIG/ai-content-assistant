import mongoose, { Schema, model } from "mongoose";

const contentSchema = new Schema(
  {
    prompt: { type: String, required: true },
    type: { type: String, required: true },
    tone: { type: String, required: true },
    output: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Prompt = model("Prompt", contentSchema);
export default Prompt;
