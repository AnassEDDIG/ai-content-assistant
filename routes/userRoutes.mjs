import { Router } from "express";
import { protect } from "../controllers/authController.mjs";
import { updateUser } from "../controllers/userController.mjs";

const router = Router();

router.patch("/", protect, updateUser);

export default router;
