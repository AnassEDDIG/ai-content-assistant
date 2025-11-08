import mongoose from "mongoose";

const toneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Tone = mongoose.model("Tone", toneSchema);
export default Tone;
