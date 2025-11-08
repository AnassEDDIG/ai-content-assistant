import mongoose from "mongoose";

export default function connectToDB(uri) {
  mongoose
    .connect(uri)
    .then(() => console.log("Atlas DB connected ✅"))
    .catch((err) => console.error("❌MongoDB connection error:", err));
}
