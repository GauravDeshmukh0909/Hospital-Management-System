
import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { addDoctor, getAllDoctors } from "../controllers/doctor.controller.js";
import { getAllPatients, registerPatient } from "../controllers/patient.controller.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.post("/doctor", addDoctor);
router.post("/patient", registerPatient);
router.get('/doctors', getAllDoctors);  
router.get('/patients', getAllPatients);

export default router;
