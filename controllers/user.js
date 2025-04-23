import { user} from "../models/user.js";
import bcrypt from 'bcrypt'
import Cookies from 'js-cookie'
import jwt from  "jsonwebtoken"

// import multer from 'multer';
import path from 'path';

import multer from 'multer';
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });
export const uploadResume = upload.single('resume');



import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier'; // For streaming buffer to Cloudinary

export const register = async (req, res) => {
  try {
    const { name, email, password, phoneno } = req.body;

    if (!name || !email || !password || !phoneno) {
      return res.status(400).json({
        message: "All details are required",
        success: false,
      });
    }

    const userExists = await user.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let resumeUrl = null;
    let resumename = null;

    if (req.file) {
      resumename = req.file.originalname;
    
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto', // <-- This is key
              folder: 'resumes',
              public_id: resumename.split('.')[0],
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };
    
      const result = await streamUpload(req.file.buffer);
      resumeUrl = result.secure_url;
    }
    

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
      phoneno,
      resume: resumeUrl,     // Store Cloudinary URL
      resumename: resumename // Store original filename
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

  

// Middleware to handle resume uploads
// export const uploadResume = upload.single('resume');




export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);

        if (!email || !password) {
            console.log("error 1");
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        const user1 = await user.findOne({ email });
        if (!user1) {
            console.log("error 2");
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user1.password);
        if (!isPasswordValid) {
            console.log("error 3");
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            });
        }

        const tokenData = { userId: user1._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '3d' });
        console.log("no error in login backend",process.env.SECRET_KEY);
        return res
            .status(200)
            .cookie("token", token, {
                maxAge:3*24*3600*1000,
                httpOnly:true,
                sameSite: 'None',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({
                message: "Login successful.",
                success: true,
                token, // Optional: send token in response for debugging
            });

    } catch (error) {
        console.error("Error during login:", error.message);
        console.log("Error during login:", error.message);

        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};


export const logout = async(req,res)=> {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged Out",
            success:true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal sever error",success:false});
    }
}


export const updateprofile= async(req,res)=> {
    const {name,email,phoneno,skills,cgpa,experience,gradyear}=req.body;
    const file=req.file;
    const skillsarray=skills.split(",");
    
    const userId=req._id;
    let user1 = await user.findById(userId);
    if(!user1) {
        return res.status(404).json({
            message:"something went wrong",
            success:false,
        })
    }

    if(name) user1.name=name;
    if(email) user1.email=email;
    if(phoneno) user1.phoneno=phoneno;
    if(skills) user1.skills=skillsarray;
    if(cgpa) user1.cgpa=cgpa;
    if(experience) user1.experience=experience;
    if(gradyear) user1.gradyear=gradyear;

    await user1.save();

    return res.status(200).json({
        message:"Profile updated Successfully",
        user1,
        success:true,
    })
}



export const getResumeUrl = async (req, res) => {
  try {
    const userId = req.id; // e.g., /user/resume/:id

    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!userData.resume) {
      return res.status(404).json({
        message: "Resume not uploaded",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Resume URL fetched successfully",
      resumeUrl: userData.resume,
      success: true,
    });

  } catch (error) {
    console.error("Error fetching resume URL:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


