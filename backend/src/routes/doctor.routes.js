import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { getPatientById, getTodaysPatients } from "../controllers/doctor.controller.js";
import { createPrescription } from "../controllers/prescription.controller.js";

const router = express.Router();

router.use(protect, restrictTo("doctor"));

// router.get("/patients/today", getTodaysPatients);
// router.post("/prescription", createPrescription);
router.get("/patients/today", getTodaysPatients);

// Get specific patient by ID (needed for prescription page)
router.get("/patients/:patientId", getPatientById);

// Create prescription
router.post("/prescription", createPrescription);


export default router;
