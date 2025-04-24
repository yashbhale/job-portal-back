import express from 'express'
import { job} from '../models/job.js'
import { user } from '../models/user.js'
import { company } from '../models/company.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const createjob = async(req,res)=> {
    try {
        const {title, description,qualification,reqskills,minexp,location,salary,deadline}=req.body;
        const compid=req.id;
        console.log("Company ID from request:", req.id);
        const companyj = await company.findOne({_id:compid});
        if(!companyj)
        {
            console.log("error 1")
        }


        const newjob=await job.create({
            title,
            description,
            qualification,
            reqskills,
            minexp,
            location,
            salary,
            deadline,
            comp:compid
        })

        companyj.jobs.push(newjob._id); 
    await companyj.save();

        return res.status(201).json({
            message:"job created successfully",
            success:true,
        })

    }
    catch(error) {
        console.log("mmmmmm",error);
        console.error(error);
        return res.status(500).json({message:"Internal sever error",success:false});
    }
}

export const DisplayAllJobs = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let jobfull;

        if (searchQuery) {
            // Filter jobs based on title, location, description, etc.
            jobfull = await job.find({
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { location: { $regex: searchQuery, $options: "i" } },
                    { description: { $regex: searchQuery, $options: "i" } },
                ]
            }).populate('comp');
        } else {
            // If no search, fetch all
            jobfull = await job.find().populate('comp');
        }

        if (!jobfull || jobfull.length === 0) {
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }

        console.log("Jobs fetched");
        return res.status(200).json({
            message: "Jobs fetched successfully",
            success: true,
            job: jobfull,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error fetching jobs",
            success: false,
        });
    }
}



// import Job from "../models/Job.js"; // Assuming Job is your Mongoose model

export const Userjobs = async (req, res) => {
    console.log("Fetching user jobs...");

    const userid = req.id;
    console.log("User ID:", userid);

    if (!userid) {
        console.log("User not found");
        return res.status(400).json({
            message: "User not found",
            success: false,
        });
    }

    try {
        const curruser= await user.findById(userid);
        const resumeurl=curruser.resume;
        console.log("Resume URL:", resumeurl);
        if (!resumeurl) {
            console.log("Resume not found for user");
            return res.status(404).json({
                message: "Resume not found",
                success: false,
            });
        }
        // Correcting the query to check if userid exists in the users array
        const userjobs = await job.find({ users: { $in: [userid] } });

        if (!userjobs.length) {
            // console.log("No jobs found for user");
            return res.status(404).json({
                message: "No jobs found",
                success: false,
                resume: resumeurl,

            });
        }

        

        console.log("User jobs found:", userjobs);

        return res.status(200).json({
            jobs: userjobs,
            success: true,
            resume: resumeurl,
            message: "Jobs fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};



export const Findjob=async(req,res)=>{
    const { id } = req.query; 
    // console.log(id);
    const jober = await job.findById(id); 
    if (!jober) {
        console.log("Jobs not found");
        return res.status(404).json({ error: "Job not found" });
    }
    return res.json({job:jober});
}




export const Applyjob = async (req, res) => {
    try {
        console.log("Applying for job");
        const { id } = req.query; // Job ID from query params
        
        // Extract user ID from token
        const token = req.cookies.token; // Get token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your secret key
        const userId = decoded.userId; // Extract userId from token

        console.log("Extracted userId:", userId);

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            console.log("error 1 - Invalid job ID or user ID");
            return res.status(400).json({ message: "Invalid job ID or user ID" });
        }

        // Find the job and update
        const updatedJob = await job.findByIdAndUpdate(
            id,
            { $addToSet: { users: userId } }, // Prevents duplicates
            { new: true }
        );

        if (!updatedJob) {
            console.log("error 2 - Job not found");
            return res.status(404).json({ message: "Job not found" });
        }

        // Find all jobs applied by this user
        const appliedJobs = await job.find({ users: userId });
        console.log("Applied Jobs:", appliedJobs);
        
        res.status(200).json({ message: "Job applied successfully", appliedJobs });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



