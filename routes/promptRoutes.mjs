import { Router } from "express";
import {
  deletePrompt,
  generateText,
  getPromptHistory,
} from "../controllers/contentController.mjs";
import { getAllTones } from "../controllers/tonesController.mjs";
import { getAllTypes } from "../controllers/typesController.mjs";
import { protect } from "../controllers/authController.mjs";

const router = Router();

router.post("/generateText", protect, generateText);
router.get("/history", protect, getPromptHistory);
router.get("/tones", getAllTones);
router.get("/types", getAllTypes);
router.delete("/content/:id", deletePrompt);

export default router;
