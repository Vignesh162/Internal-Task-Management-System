import Task from "../models/task.js";
import cloudinary from "cloudinary";

// Configure Cloudinary (optional, needed only if you want to delete attachments)
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME || "dvjkompau",
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// @desc   Create a new task
// @route  POST /api/tasks
export const createTask = async (req, res) => {
  try {
    let {
      title,
      description,
      attachments = [],
      assignedTo,
      assignedBy,
      deadline,
      priority = "Low",
      comments = [],
      status = "pending",
    } = req.body;

    if (!assignedBy) assignedBy = req.user._id;

    const newTask = new Task({
      title,
      description,
      attachments, // Cloudinary URLs from frontend
      assignedTo,
      assignedBy,
      deadline,
      priority,
      status,
      progress: 0,
      comments,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", details: error.message });
  }
};

// @desc   Get all tasks
// @route  GET /api/tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// @desc   Get task by ID
// @route  GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task", details: error.message });
  }
};

// @desc   Update a task
// @route  PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { attachments } = req.body; // Cloudinary URLs
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, attachments },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
};

// @desc   Delete a task (optional: delete attachments from Cloudinary)
// @route  DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Optional: delete attachments from Cloudinary
    for (const url of task.attachments) {
      const publicId = url.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(publicId);
    }

    await task.remove();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
};

// @desc   Update task progress
// @route  PUT /api/tasks/:id/progress
export const updateTaskProgress = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    let progress = Number(req.body.progress);
    if (isNaN(progress)) return res.status(400).json({ error: "Progress must be a number" });
    progress = Math.max(0, Math.min(100, progress));

    task.progress = progress;
    task.status = progress === 100 ? "completed" : progress > 0 ? "in-progress" : "pending";

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task progress", details: error.message });
  }
};

// @desc   Add comment to a task
// @route  POST /api/tasks/:id/comment
export const addCommentToTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { text } = req.body;

    if (!req.user || !text) {
      return res.status(400).json({ error: "User ID and comment text are required." });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $push: { comments: { user: req.user._id, text } } },
      { new: true }
    ).populate("comments.user", "name email");

    if (!updatedTask) return res.status(404).json({ error: "Task not found." });

    res.status(200).json({ message: "Comment added successfully!", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment.", details: error.message });
  }
};

// ===== Task filtering by status and assignedTo =====
export const getAllTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getInProgressTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "in-progress", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getCompletedTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "completed", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getPendingTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "pending", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// Admin routes
export const getAllInProgressTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "in-progress" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getAllCompletedTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "completed" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getAllPendingTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "pending" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};
