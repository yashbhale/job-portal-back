import express from "express";
import { registerc,loginc, getcompanyjobs } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router=express.Router();

router.route('/register').post(registerc);
router.route('/login').post(loginc);
router.route('/jobs').get(isAuthenticated,getcompanyjobs);

export default router;
