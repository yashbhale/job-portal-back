import { company } from "../models/company.js";
import bcrypt from 'bcrypt'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

export const registerc = async(req,res)=> {
    try {
        const {name,email,password,logo}=req.body;
        const user = await company.findOne({email:email})
        if(user) {
            console.log("error1");
            return res.status(400).json({
                message:"Company already Exists",
                success:false,
            })
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const c=await company.create({
            name,
            email,
            password:hashedpassword,
            logo
        })
        c.save();
        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            c
        });
    }
    catch(error) {
        console.log("error2");
        console.error(error);
        return res.status(500).json({message:"Internal sever error",success:false});
    }
}


export const loginc = async(req,res)=> {
    try {
        const {email,password}=req.body;
        console.log("xxxxxxxxx",req.body)
        const user=await company.findOne({email});
        if (!user) {
            console.log("error3");
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        const isvalid=await bcrypt.compare(password,user.password);
        if(!isvalid)
        {
            console.log("error4");
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            });
        }

        const tokenData = {userId:user._id};
        const token = jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'3d'});
        return res.status(200).cookie("token",token,{
            maxAge:3*24*3600*1000,
            httpOnly:true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: "Login successful.",
            success: true,
            token, 
        });

    } catch (error) {
        console.log("error5");
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
}

export const getcompanyjobs=async  (req,res)=> {
    const compid=req.id;
    console.log(compid);
    if(!compid) {
        console.log("Company not found");
        return res.status(400).json({
            message: "company not found",
            success: false,
        });
    }
    const compjobs=await company.findById(compid).populate("jobs");
    if(!compjobs) {
        console.log("Jobs not found");
        return res.status(404).json({
            message: "Jobs not found",
            success: false,
        });
    }
    console.log("xxxxxxxxxxxxxx",compjobs.jobs);
    return res.status(200).json({
        jobs: compjobs.jobs, 
        success: true,
    });
}