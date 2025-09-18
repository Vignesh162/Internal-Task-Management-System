import Task from "../models/task.js"; 
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME || "dvjkompau",
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ==================== CREATE TASK ====================
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
      attachments, // Optional Cloudinary URLs
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

// ==================== GET TASKS ====================
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task", details: error.message });
  }
};

// ==================== UPDATE TASK ====================
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { progress, attachments, ...otherFields } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Update attachments if provided
    if (attachments && attachments.length > 0) {
      task.attachments = attachments;
    }

    // Update other fields
    Object.keys(otherFields).forEach(key => task[key] = otherFields[key]);

    // Update progress
    if (progress !== undefined) {
      let prog = Number(progress);
      if (isNaN(prog)) return res.status(400).json({ error: "Progress must be a number" });
      prog = Math.min(100, Math.max(0, prog));
      task.progress = prog;
      task.status = prog === 100 ? "completed" : prog > 0 ? "in-progress" : "pending";
    }

    const updatedTask = await task.save();
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
};

// ==================== DELETE TASK ====================
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Delete attachments from Cloudinary (optional)
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

// ==================== UPDATE TASK PROGRESS ONLY ====================
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

// ==================== ADD COMMENT ====================
export const addCommentToTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { text } = req.body;

    if (!req.user || !text) return res.status(400).json({ error: "User ID and comment text are required." });

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

// ==================== FILTER TASKS ====================
// By assignedTo
export const getAllTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getInProgressTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "in-progress", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getCompletedTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "completed", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getPendingTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "pending", assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// ==================== ADMIN FILTER ROUTES ====================
export const getAllInProgressTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "in-progress" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getAllCompletedTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "completed" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getAllPendingTask = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "pending" })
      .populate("assignedTo assignedBy", "name email")
      .populate("comments.user", "name email").sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};
