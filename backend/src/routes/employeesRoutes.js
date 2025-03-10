import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async(req, res) => {
    try{
    const employees = await User.find({ role: "employee" });
    res.status(200).json(employees);
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch employees", details: error.message});
    }
})

export default router;