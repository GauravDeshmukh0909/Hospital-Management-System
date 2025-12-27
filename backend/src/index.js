import express from "express";
import cors from "cors";
import dotenv from "dotenv";


/* ROUTES */
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import hospitalRoutes from './routes/hospital.routes.js'



import connectDB from "./db/index.js";



dotenv.config();




const app = express();
const PORT = process.env.PORT || 3000;




connectDB();


app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/admin", hospitalRoutes);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
