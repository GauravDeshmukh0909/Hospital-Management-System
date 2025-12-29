import Doctor from "../models/Doctor.model.js";
import Prescription from "../models/Prescription.model.js";

export const createPrescription = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const prescription = await Prescription.create({
      patient: req.body.patient,
      medicines: req.body.medicines,
      date: req.body.date || new Date(),
      doctor: doctor._id, // ✅ THIS WAS MISSING
    });

    res.status(201).json(prescription);
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({ message: error.message });
  }
};
