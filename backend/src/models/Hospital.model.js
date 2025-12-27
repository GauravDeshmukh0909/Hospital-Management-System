import mongoose from "mongoose";


const hospitalSchema = new mongoose.Schema({
    
  name: { 
    type: String,
    required: true
  },
  address: String,
  phone: String
});



export default mongoose.model("Hospital", hospitalSchema);
