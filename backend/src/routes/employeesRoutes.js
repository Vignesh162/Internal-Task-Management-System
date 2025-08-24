import express from "express";
import User from "../models/user.js";
import { protect,admin } from "../middleware/authMiddleware.js";
import { getEmployees, updateEmployee } from "../controllers/employeeController.js";

const router = express.Router();

// get all employees route
router.get("/", protect, admin, getEmployees);

// update employee info route
router.put("/", protect, admin, updateEmployee);

export default router;