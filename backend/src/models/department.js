import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // ✅ Ensures department names are unique
      trim: true,   // ✅ Removes extra spaces
    },
    description: {
      type: String,
      trim: true,   // ✅ Removes unnecessary spaces
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ✅ Reference should match the actual model name
      },
    ],
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

const Department = mongoose.model("Department", departmentSchema); // ✅ Capitalized model name for consistency
export default Department;
