// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import dotenv from "dotenv";
// import User from "../models/User.model.js";

// dotenv.config();

// const createAdmin = async () => {
//   try {
//     await mongoose.connect('mongodb+srv://db_user:3CRrpCYG58nnI9hD@cluster0.5qopnj1.mongodb.net/HospitalManagement');

//     const email = "admin@hospital.com";
//     const password = "admin123";

//     const existing = await User.findOne({ email });
//     if (existing) {
//       console.log("Admin already exists");
//       process.exit(0);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name: "Admin",
//       email,
//       password: hashedPassword,
//       role: "admin"
//     });

//     console.log("✅ Admin created successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// createAdmin();
