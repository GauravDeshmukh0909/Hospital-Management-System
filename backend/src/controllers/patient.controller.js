
import Patient from "../models/Patient.model.js";

export const registerPatient = async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
};


export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('doctor')
      .populate('hospital')
      .sort({ registrationDate: -1 });
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};