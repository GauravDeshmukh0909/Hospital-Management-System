import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phone: String,
  address: String,
  complaint: String,
  doctor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  registrationDate: {
    type: Date,
    default: () => new Date().setHours(0,0,0,0)
  }
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
