
import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import Patient from "../models/Patient.model.js";
import bcrypt from "bcryptjs";
import Prescription from "../models/Prescription.model.js";

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





// export const getTodaysPatients = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     console.log("Doctor ID:", req.user.userId);
//     console.log("Looking for patients between:", today, "and", tomorrow);

//     const patients = await Patient.find({
//       doctor: req.user.userId,
//       createdAt: {
//         $gte: today,
//         $lt: tomorrow,
//       },
//     }).sort({ createdAt: -1 });

//     console.log("Found patients:", patients.length);

//     res.status(200).json(patients);
//   } catch (error) {
//     console.error("Error fetching today's patients:", error);
//     res.status(500).json({
//       message: "Error fetching patients",
//       error: error.message,
//     });
//   }
// };


import mongoose from "mongoose";
//import Patient from "../models/Patient.model.js";

// import Doctor from "../models/Doctor.model.js";
// import Patient from "../models/Patient.model.js";

export const getTodaysPatients = async (req, res) => {
  try {
    // 🔁 Map logged-in user → doctor profile
    const doctor = await Doctor.findOne({ user: req.user.userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const patients = await Patient.find({
      doctor: doctor._id, // ✅ MATCHES STORED DATA
      createdAt: { $gte: start, $lt: end },
    }).sort({ createdAt: -1 });

    res.json({ count: patients.length, patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
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



export const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate("patient", "name age gender")
      .populate("medicines.medicine", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Prescription error:", error);
    res.status(500).json({ message: error.message });
  }
};
