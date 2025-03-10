import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import employeeRoutes from "./src/routes/employeesRoutes.js";
import cors from "cors";

dotenv.config(); // ✅ Load environment variables
console.log(process.env.MONGO_URI);
// Initialize Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes

// Task Routes
app.use("/api/task", taskRoutes);
// Authentication Routes
app.use("/api/auth", authRoutes);
// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);
// Department Routes
app.use("/api/department", departmentRoutes);
// Employee Routes
app.use("/api/employee", employeeRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    try{
        connectDB();
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
});
