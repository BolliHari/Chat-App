import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";



export const signup = async (req, res) => {
    try {
        const {fullName, email, password, bio} = req.body;
        if(!fullName || !email || !password || !bio) {
            return res.json({ success:false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if(user) {
            return res.json({ success: false, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ fullName, email, password : hashedPassword, bio });
        console.log(newUser);
        const token = generateToken(newUser._id);
        console.log(token);

        res.json({ success: true, userData : newUser, message: "User registered successfully" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: "Internal server error" });
    }
}


export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        const isPasswordCorrect =await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "User logged in successfully" });
    }
    catch(error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
}




export const checkAuth = async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updateProfile;
        if(!profilePic){
            updateProfile = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
        } else {
            const cloudinaryResponse = await cloudinary.uploader.upload(profilePic);
            updateProfile = await User.findByIdAndUpdate(userId, { fullName, bio, profilePic: cloudinaryResponse.secure_url }, { new: true });
        }
        res.json({ success: true, user: updateProfile , message:"Profile Updated"});
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
}