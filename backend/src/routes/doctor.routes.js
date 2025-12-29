import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { getDoctorPrescriptions, getPatientById, getTodaysPatients } from "../controllers/doctor.controller.js";
import { createPrescription } from "../controllers/prescription.controller.js";

const router = express.Router();

router.use(protect, restrictTo("doctor"));


router.get("/patients/today", getTodaysPatients);


router.get("/patients/:patientId", getPatientById);


router.post("/prescription", createPrescription);

router.get("/prescriptions", getDoctorPrescriptions);


export default router;
