const mongoose = require("mongoose");

const tokenCounterSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  currentToken: {
    type: Number,
    default: 0
  },
  lastToken: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["ACTIVE", "PAUSED", "COMPLETED"],
    default: "ACTIVE"
  }
});

tokenCounterSchema.index({ doctorId: 1, date: 1 }, { unique: true });

const TokenCounter = mongoose.model("TokenCounter", tokenCounterSchema);

module.exports = TokenCounter;