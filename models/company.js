import mongoose from "mongoose";
import { job } from "./job.js";

const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    logo: String,
    jobs: [{type: mongoose.Schema.Types.ObjectId,ref:'job'}] 
});

export const company = mongoose.models.company || mongoose.model('company',schema); 
