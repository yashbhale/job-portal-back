import express from "express"
import {login,register,updateprofile,logout, uploadResume, getResumeUrl} from "../controllers/user.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { upload } from "../config/cloudinaryConfig.js"; // Import upload middleware


const router=express.Router();


router.route('/register').post(uploadResume,register);
router.route('/login').post(login);
router.route('/profile/update').post(isAuthenticated,updateprofile);
router.route('/logout').get(logout);
router.route('/getresume').get(isAuthenticated, getResumeUrl);



export default router;
