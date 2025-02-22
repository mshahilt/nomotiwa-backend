const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  tokenNumber: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  patientInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  }
});

const doctorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  availability: { 
    type: Boolean, 
    default: true 
  },
  slots: [slotSchema]
});

doctorSchema.index({ 
  "_id": 1, 
  "slots.date": 1, 
  "slots.tokenNumber": 1 
}, { 
  unique: true 
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;