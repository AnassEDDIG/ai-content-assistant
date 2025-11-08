import Prompt from "../models/Prompt.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim());

export async function generateText(req, res) {
  const { prompt, type, tone } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Generate a ${type} in a ${tone} tone for: ${prompt}`
    );
    const output = result.response.text();

    const newPrompt = new Prompt({
      prompt,
      type,
      tone,
      output,
      userId: req.user.id,
    });
    await newPrompt.save();

    res.json({
      status: "success",
      data: { output },
    });
  } catch (error) {
    console.error("Gemini generation error:", error);

    const statusCode = error?.status || 500;
    let message = "Generation failed. Please try again later.";

    if (statusCode === 503) {
      message =
        "The AI model is currently overloaded. Please try again shortly.";
    } else if (statusCode === 401 || statusCode === 403) {
      message = "Authentication error with Gemini API. Check your API key.";
    } else if (statusCode === 429) {
      message =
        "Too many requests. You are being rate-limited. Please wait and try again.";
    }

    res.status(statusCode).json({
      status: "fail",
      message,
    });
  }
}
export async function getPromptHistory(req, res) {
  try {
    const userId = req.user.id;

    const history = await Prompt.find({ userId })
      .sort({ createdAt: -1 })
      .select("prompt type tone output createdAt"); 

    res.json({
      status: "success",
      data: history,
    });
  } catch (error) {
    console.error("Failed to fetch prompt history:", error);
    res.status(500).json({
      status: "fail",
      message: "Could not retrieve prompt history.",
    });
  }
}

export async function deletePrompt(req, res) {
  const { id } = req.params;

  try {
    const deleted = await Prompt.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Prompt not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Prompt deleted successfully." });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
