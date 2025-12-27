
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  specialization: String,
  phone: String,
  hospital: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
 }
});

export default mongoose.model("Doctor", doctorSchema);
