import express from "express";
import { Applyjob, createjob, DisplayAllJobs, Findjob, Userjobs } from "../controllers/jobs.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router=express.Router();

router.route('/createjob').post(isAuthenticated,createjob);
router.route('/displayjobs').get(DisplayAllJobs);
router.route('/findjob').get(Findjob);
router.route('/getuserjobs').get(isAuthenticated,Userjobs);
router.route('/applyjob').post(isAuthenticated,Applyjob);

export default router;