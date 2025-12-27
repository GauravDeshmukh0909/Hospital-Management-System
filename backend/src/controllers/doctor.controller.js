
import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import Patient from "../models/Patient.model.js";
import bcrypt from "bcryptjs";

export const addDoctor = async (req, res) => {
  const { name, email, password, specialization, phone, hospital } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "doctor" });

  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    phone,
    hospital
  });

  res.status(201).json(doctor);
};




export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email') 
      .populate('hospital', 'name location')
      .sort({ createdAt: -1 });
    res.status(200).json({ 
      message: "Doctors fetched successfully", 
      data: doctors 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};





export const getTodaysPatients = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("Doctor ID:", req.user._id);
    console.log("Looking for patients between:", today, "and", tomorrow);

    const patients = await Patient.find({
      doctor: req.user._id,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ createdAt: -1 });

    console.log("Found patients:", patients.length);

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching today's patients:", error);
    res.status(500).json({ 
      message: "Error fetching patients", 
      error: error.message 
    });
  }
};


export const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

   
    if (patient.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ 
      message: "Error fetching patient", 
      error: error.message 
    });
  }
};