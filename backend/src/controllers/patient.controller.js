
import Patient from "../models/Patient.model.js";
import Doctor from "../models/Doctor.model.js";

export const registerPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      address,
      complaint,
      doctor,   // Doctor._id from admin UI
      hospital,
    } = req.body;

    // 🔍 Validate doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(400).json({ message: "Invalid doctor selected" });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      address,
      complaint,
      doctor: doctorExists._id, // ✅ Doctor._id
      hospital,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      })
      .populate("hospital")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};