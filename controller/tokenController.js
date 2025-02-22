const TokenCounter = require("../models/TokenCounter");
const { emitTokenUpdate } = require("../socket.io/socket");

// Increment Token
const incrementToken = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const today = new Date().toISOString().split("T")[0]; // Get only date (YYYY-MM-DD)

    let tokenCounter = await TokenCounter.findOne({ doctorId, date: today });

    if (!tokenCounter) {
      tokenCounter = new TokenCounter({
        doctorId,
        date: today,
        currentToken: 1,
        lastToken: 1,
        status: "ACTIVE"
      });
    } else {
      if (tokenCounter.status !== "ACTIVE") {
        return res.status(400).json({ message: "Token system is not active" });
      }
      tokenCounter.currentToken += 1;
      tokenCounter.lastToken += 1;
    }

    await tokenCounter.save();
    await emitTokenUpdate(doctorId);

    res.json({ message: "Token incremented", token: tokenCounter.currentToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Token Status
const getTokenStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const tokenCounter = await TokenCounter.findOne({ doctorId, date: today }).lean();

    if (!tokenCounter) {
      return res.status(404).json({ message: "No token found for today" });
    }

    res.json(tokenCounter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { incrementToken, getTokenStatus };
