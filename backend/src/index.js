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



dotenv.config({ path: "../.env" });





const app = express();
const PORT = process.env.PORT || 3000;




connectDB();

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(cors({
  origin: "*", // replace with frontend URL later
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/admin", hospitalRoutes);


/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hospital Management System API is running 🚑"
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});



/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
