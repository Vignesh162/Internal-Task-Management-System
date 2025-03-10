import express from "express";
import { createDepartment, getDepartments } from "../controllers/departmentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect,admin, createDepartment);
router.get("/",protect,admin, getDepartments);

export default router;