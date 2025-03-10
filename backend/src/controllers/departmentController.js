import Department from "../models/department.js";

export const getDepartments = async (req,res) =>
{
    try{
        const departments = await Department.find();
        res.status(200).json(departments);
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch departments", details: error.message});
    }
}

export const createDepartment = async (req,res) => {
    try{
        const {name,description} = req.body;
        const newDepartment = new Department({name,description});
        newDepartment.save();
        res.status(201).json(newDepartment);
    }
    catch(error){
        res.status(500).json({error:"Failed to create department", details: error.message});
    }
}