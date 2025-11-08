import dotenv from "dotenv";
import Tone from "../models/Tone.mjs";
import Type from "../models/Type.mjs";
import connectToDB from "../config/connectToDB.mjs";

dotenv.config();
const uri = process.env.DB_URI.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

connectToDB(uri);

const action = process.argv[2];

if (action == "--seed") {
  await Type.insertMany([
    { name: "Blog Post" },
    { name: "Social Media Post" },
    { name: "Product Description" },
    { name: "Poem" },
    { name: "Email" },
    { name: "Story" },
    { name: "Ad Copy" },
    { name: "Tutorial" },
    { name: "Code" },
    { name: "Joke" },
    { name: "News Article" },
    { name: "Speech" },
  ]);

  await Tone.insertMany([
    { name: "Friendly" },
    { name: "Professional" },
    { name: "Funny" },
    { name: "Motivational" },
    { name: "Serious" },
    { name: "Empathetic" },
    { name: "Witty" },
    { name: "Sarcastic" },
    { name: "Inspiring" },
    { name: "Casual" },
    { name: "Formal" },
  ]);
  console.log("Seeded successfully!");
} else if (action == "--clear") {
  await Tone.deleteMany({});
  await Type.deleteMany({});
  console.log("cleared successfully!");
}
process.exit();
