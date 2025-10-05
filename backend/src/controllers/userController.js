import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export const Login = async(req,res)=>{
  const{email,password}=req.body;

  try {
    const user = await User.findOne({email});
    if(!User){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    const isPasswordCorrect = user.password=password;
    if(!isPasswordCorrect){
      return res.status(401).json({
        success:false,
        message:"Incorrect password"
      });
    }
    res.status(200).json({
      success:true,
      message:"User logged in successfully"
    });
  } catch (error) {
    console.error("Error during login:",error);
    res.status(500).json({
      success:false,
      message:"server error"
    });
  }
};

export const ForgotPassword = async(req,res)=>{
  try {
    const{email} = req.body;

    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required"
      });
    }

    const checkUser = await User.findOne({email});

    if(!checkUser){
      return res.status(404).json({
        success:false,
        message:"User not found , please register "
      });
    }

    const token = jwt.sign({email}, process.env.JWT_SECRET_KEY,{
      expiresIn:"1hr",
    });

    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.MY_GMAIL,
        pass:process.env.MY_PASSWORD,
      },
    });

    const receiver ={
      from:"sakshishinde16093@gmail.com",
      to:email,
      subject:"Reset Password Request",
      text:`Click on this link to generate your new password: ${process.env.CLIENT_URL}/reset-password ${token}`,
      };

      await transporter.sendMail(receiver);

      return res.status(200).json({
        success:true,
        message:"Password reset link sent successfully on your gmail account",
      });
  } catch (error) {
    return res.status(500).json({
      success:false,
    //   message:"server error",
    message: error.message,
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Token received:", token);
    console.log("Password received:", password);

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your new password",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decode);

    const user = await User.findOne({ email: decode.email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

     const newhashPassword = await bcrypt.hash(password, 10); // Hash the password
        user.password = newhashPassword;
        await user.save();
    console.log("New hashed password:", newhashPassword);

    user.password = newhashPassword;
    await user.save();
    console.log("Password updated successfully");

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in ResetPassword:", error); 
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
