import User from "../models/user.js";
export const getEmployees = 
    async(req, res) => {
    try{
    const employees = await User.find({ role: "employee" });
    res.status(200).json(employees);
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch employees", details: error.message});
    }
};
export const updateEmployee = 
    async(req,res)=>{
        try{
            const { id, name, department, status} = req.body;

            if(!id){
                return res.status(400).json({ message: "Id not found!" });
            }

            const employee = await User.findById(id);
            if(!employee){ 
                return  res.status(404).json({ message: "Employee not found!" });
            }

            const updatedEmployee = await User.findByIdAndUpdate(
                id,
                { $set: { name, department, status } },
                { new: true } // return updated doc
            );

            return res.status(200).json({
            message: "Employee updated successfully",
            employee:updateEmployee,
            });

        }catch(err){
            console.log(err);
        }
};
