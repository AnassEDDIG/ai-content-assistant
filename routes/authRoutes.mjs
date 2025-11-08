import { Router } from "express";
import {
  signin,
  signup,
  signout,
  requestPasswordReset,
  resetPassword,
  getMe,
} from "../controllers/authController.mjs";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

router.get("/me", getMe);

export default router;
