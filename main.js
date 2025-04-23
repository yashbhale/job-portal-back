import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from 'dotenv'
import connectDB from "./utils/connectDB.js"
import userrouter from "./routes/user.router.js"
import companyrouter from "./routes/company.router.js"
import jobrouter from "./routes/job.router.js";
import cookieParser from 'cookie-parser';

dotenv.config({});

const app = express();
const PORT = process.env.PORT|| 5001;

app.use(cors({ origin: 'http://localhost:5173', credentials:true}));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user",userrouter);
app.use('/api/v1/company',companyrouter);
app.use('/api/v1/job',jobrouter);

app.get('/',(req,res)=>{
    res.send('Api is working')
})

app.listen(PORT, () => {
    connectDB();
    console.log(`App listening on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error(`Permission denied on port ${PORT}. Try using a different port.`);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    }
    process.exit(1); // Exit process with failure
});



