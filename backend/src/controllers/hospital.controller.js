import Hospital from "../models/Hospital.model.js";


export const createHospital = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Hospital name is required" });
    }

    const exists = await Hospital.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    const hospital = await Hospital.create({
      name,
      address,
      phone
    });

    res.status(201).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });

    res.json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
