import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'job', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'company', required: true },
        resume: { type: String, required: true }, 
        appliedAt: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ["Pending", "Shortlisted", "Rejected", "Hired"], 
            default: "Pending" 
        }, 
    },
    { timestamps: true }
);

export const application = mongoose.models.application || mongoose.model('application', schema);
