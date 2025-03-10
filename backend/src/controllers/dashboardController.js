import Task from '../models/task.js';
import User from '../models/user.js';
import Department from '../models/department.js';
import router from '../routes/taskRoutes.js';
export const getDashboardStats = async(req,res) => {
    try{
        let stats = {};
        const user = req.user;
        if(!user) return res.status(404).json({error:"User not found"});
        if(user.role === "admin")
        {
            stats ={
            employees : await User.countDocuments(),
            departments: await Department.countDocuments(),
            allTasks : await Task.countDocuments(),
            pendingTasks : await Task.countDocuments({status:"pending"}),
            inProgressTasks : await Task.countDocuments({status:"in-progress"}),
            completedTasks : await Task.countDocuments({status:"completed"}),
            }
        }
        else{
            stats ={
                allTasks : await Task.countDocuments({assignedTo:{$in:[user._id]}}),
                pendingTasks : await Task.countDocuments({assignedTo:{$in:[user._id]}, status:"pending"}),
                inProgressTasks : await Task.countDocuments({assignedTo:{$in:[user._id]}, status:"in-progress"}),
                completedTasks : await Task.countDocuments({assignedTo:{$in:[user._id]}, status:"completed"}),
            }
        }
        res.status(200).json(stats);
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch stats", details: error.message});
    }
}
