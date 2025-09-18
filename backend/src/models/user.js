import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "employee","manager"],
        default: "employee",
    },
    position:{
        type: String,
        default:"NA",
    },
    department: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum:["active","inactive"],
        default:"active",
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    },
});

// 🔹 Hash password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
  });
  
  // 🔹 Compare passwords for login
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
const User = mongoose.model("User", userSchema);
export default User;