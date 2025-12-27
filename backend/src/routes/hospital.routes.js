import express from "express";
import {
  createHospital,
  getAllHospitals
} from "../controllers/hospital.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin only
router.post("/hospital", protect, restrictTo("admin"), createHospital);
router.get("/hospitals", protect, restrictTo("admin"), getAllHospitals);

export default router;
