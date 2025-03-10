import User from "../models/user.js";
import generateToken from "../utils/jwt.js";

// /api/auth

// 🔹 Register New User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password,department} = req.body;
    const role = "employee";
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create user
    const newUser = await User.create({ name, email, password, role, department });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser._id),
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 🔹 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // // Check role
    // if (user.role === "admin") return res.status(403).json({ message: "Please Login Using Admin Portal" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Check role
    if (user.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only!" });

    res.status(200).json({
      message: "Admin login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Admin login failed", error: error.message });
  }
};

// update user credentials
export const updateUser = async (req,res) =>
{
  try{
    const {targetProperty, email} = req.body
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message:"User not found"});
    
    if(targetProperty === "password"){
      user.password = req.body.password;
      await user.save();
      return res.status(200).json({message:"Password updated successfully"});
    }
    else if(targetProperty === "name"){
      user.name = req.body.name;
      await user.save();
      return res.status(200).json({message:"Name updated successfully"});
    }
    else
    {
      console.log("invalid property");
    }

  }
  catch(error){
    res.status(500).json()
  }
}

export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user); // Respond with the authenticated user's details
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
