import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["in-progress", "completed", "pending"], default: "pending" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
   attachments: [
      {
        public_id: { type: String }, // remove `required: true`
        url: { type: String }        // remove `required: true`
      }
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
