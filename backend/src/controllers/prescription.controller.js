
import Prescription from "../models/Prescription.model.js";

export const createPrescription = async (req, res) => {
  const prescription = await Prescription.create(req.body);
  res.status(201).json(prescription);
};
