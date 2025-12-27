import express from "express";
import { addMedicine, getAllMedicines ,} from "../controllers/medicine.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = express.Router();



router.post("/", protect, restrictTo("admin"), addMedicine);
router.get("/", protect, restrictTo("admin", "doctor"), getAllMedicines);

export default router;
