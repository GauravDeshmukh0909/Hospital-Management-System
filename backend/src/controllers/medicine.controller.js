import Medicine from "../models/Medicine.model.js";


export const addMedicine = async (req, res, next) => {
  try {
    const { name, genericName, strength, type, company } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const medicine = await Medicine.create({
      name,
      genericName,
      strength,
      type,
      company
    });

    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};


export const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    next(error);
  }
};
