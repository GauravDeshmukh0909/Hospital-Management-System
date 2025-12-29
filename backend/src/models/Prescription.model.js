import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    medicines: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        dosage: String,
        duration: String,
        notes: String,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // ✅ ADD THIS
);


export default mongoose.model("Prescription", prescriptionSchema);
