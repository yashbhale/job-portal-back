import mongoose from "mongoose";

const connectDB= async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection Succeeded");
    } catch(error) {
        console.log("mmmmm"," ",error);
    }
}

export default connectDB;


