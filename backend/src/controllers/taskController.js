import express from "express";
import Task from "../models/task.js";
import User from "../models/user.js";
// @desc   Create a new task
// @route  POST /api/tasks
export const createTask = async (req, res) => {
  try {
    let { title, description,attachments, assignedTo, assignedBy, deadline, priority, comments,status,progress,file } = req.body;
    if(!priority) priority = "Low";
    if(!assignedBy) assignedBy = req.user._id;
    const newTask = new Task({
      title,
      description,
      attachments,
      assignedTo,
      assignedBy,
      deadline,
      priority,
      status,
      progress:0,
      comments
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
    const tasks = await Task.find().populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// @desc   Get a single task by ID
// @route  GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
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
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
};

export const getAllTasksByAssignedTo = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $in: [req.params.id] } })
      .populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
};

export const getInProgressTasksByAssignedTo = async (req,res) => {
  try{
    const tasks  = await Task.find({ status:"in-progress", assignedTo: { $in: [req.params.id] } })
    .populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);

  }catch(error){
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
}

export const getCompletedTasksByAssignedTo = async(req,res) => {
  try{
    const tasks = await Task.find({status:"completed", assignedTo:{$in:[req.params.id]}}).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);
  }
  catch(error){
    res.status(500).json({error:"Failed to fetch tasks", details: error.message});
  }
}
export const getPendingTasksByAssignedTo = async(req,res) => {
  try{
    const tasks = await Task.find({status:"pending", assignedTo:{$in:[req.params.id]}}).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);
  }
  catch(error){
    res.status(500).json({error:"Failed to fetch tasks", details: error.message});
  }
}

export const getAllInProgressTask = async(req,res) => {
  try{
    const tasks = await Task.find({status:"in-progress"}).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);

  }
  catch(error){
    res.status(500).json({error:"failed to fetch tasks", details:error.message});
  }
}

export const getAllCompletedTask = async(req,res) => {
  try{
    const tasks = await Task.find({status:"completed"}).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);

  }
  catch(error){
    res.status(500).json({error:"failed to fetch tasks", details:error.message});
  }
}

export const getAllPendingTask = async(req,res) => {
  try{
    const tasks = await Task.find({status:"pending"}).populate("assignedTo assignedBy", "name email").populate("comments.user", "name email");
    res.status(200).json(tasks);

  }
  catch(error){
    res.status(500).json({error:"failed to fetch tasks", details:error.message}); 
  }
}

export const updateTaskProgress = async (req,res) => {
  try{
    const task = await Task.findById(req.params.id);
    const progress = req.body.progress;
    task.progress = progress;
    // return if no progress
    if(!progress) return res.status(400).json({error:"Progress is required"});
    // update task status
    if(progress === 100) task.status = "completed";
    else if(progress < 100 && progress > 0) task.status = "in-progress";
    else task.status = "pending";
    // save updated task
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  }catch(error){
    res.status(500).json({error:"Failed to update task progress", details: error.message});
  }
};

export const addCommentToTask = async (req, res) => {
  try {
    const  taskId  = req.params.id;
    console.log(taskId);
    const {text } = req.body; // Extract taskId and comment text from request body
    // console.log(`text: ${text}`);
    // console.log(`user: ${req.user}`);
    // Validate request
    if(!taskId) return res.status(400).json({error:"Task ID is required"});
    if (!req.user || !text) {
      return res.status(400).json({ error: "User ID and comment text are required." });
    }
   
    // Find the task and update with new comment
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: { comments: { user: req.user._id, text,}},
      },
      { new: true } // Return updated task
    ).populate("comments.user", "name email"); // Populate user details in comments

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.status(200).json({ message: "Comment added successfully!", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment.", details: error.message });
  }
};
