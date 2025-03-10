import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getAllTasksByAssignedTo, getInProgressTasksByAssignedTo, getCompletedTasksByAssignedTo, getAllCompletedTask, getAllInProgressTask, getAllPendingTask, getPendingTasksByAssignedTo } from "../controllers/taskController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();
//http://localhost:5000/api/task
router.post("/",protect,admin, createTask);       // Create a task
router.get("/",protect,admin, getAllTasks);       // Get all tasks

// router.put("/:id",protect,admin, updateTask);     // Update a task
// router.delete("/:id",protect,admin, deleteTask);  // Delete a task
router.get("/allTasksAssignedTo/:id",protect,getAllTasksByAssignedTo) // Get all tasks assigned to a user
router.get("/inProgressTasksAssignedTo/:id",protect,getInProgressTasksByAssignedTo) // Get all tasks assigned to a user
router.get("/completedTasksAssignedTo/:id",protect,getCompletedTasksByAssignedTo) // Get all tasks assigned to a user
router.get("/pendingTasksAssignedTo/:id",protect,getPendingTasksByAssignedTo) // Get all tasks assigned to a user

router.get("/allCompletedTasks",protect,admin,getAllCompletedTask) // Get all completed tasks
router.get("/allInProgressTasks",protect,admin,getAllInProgressTask) // Get all in progress tasks
router.get("/allPendingTasks",protect,admin,getAllPendingTask) // Get all pending tasks

router.get("/:id",protect,admin, getTaskById);    // Get a single task by ID

export default router;
