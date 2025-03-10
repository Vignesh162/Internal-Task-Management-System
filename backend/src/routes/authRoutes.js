import express from "express";
import { registerUser, loginUser, loginAdmin, updateUser, getMe } from "../controllers/authController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
router.post("/updateUserCredentials", updateUser);
router.get("/me",protect, getMe);

export default router;
