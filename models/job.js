import mongoose from "mongoose";
import {user} from "./user.js"
import {company} from "./company.js"

const schema = new mongoose.Schema({
    title: String,
    comp: {type:mongoose.Schema.Types.ObjectId,ref:'company'},
    description: String,
    qualification: String,
    reqskills:[{type:String}],
    minexp: Number,
    location: String,
    salary: Number,
    pos:Number,
    jobtype:String,
    deadline: {type:Date},
    createdAt: {type:Date,default:Date.now},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
});

export const job=mongoose.models.job || mongoose.model('job',schema);
