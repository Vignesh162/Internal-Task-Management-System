//  import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ["Pending", "In Progress", "Completed"],
//         default: "Pending",
//     },
//     assignedTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     assignedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     dueDate: {
//         type: Date,
//         required: true,
//     },
//     comments: [
//         {
//             comment: {
//                 type: String,
//                 required: true,
//             },
//             commentedBy: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "User",
//             },
//             commentedAt: {
//                 type: Date,
//                 default: Date.now,
//             },
//         },
//     ],
//     progress: {
//         type: Number,
//         default: 0,
//     },
//     attachments: [
//         {
//             filename: {
//                 type: String,
//                 required: true,
//             },
//             path: {
//                 type: String,
//                 required: true,
//             },
//         },
//     ],
// });

// export default mongoose.model("Task", taskSchema); 
    

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }], // Now an array
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
    assignmentDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["in-progress", "completed", "pending"], default: "pending" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    attachments: [{ type: String }], 
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);
export default Task;
