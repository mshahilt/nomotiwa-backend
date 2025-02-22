const { Server } = require("socket.io");
const TokenCounter = require("../models/TokenCounter");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  console.log("✅ Socket.io initialized");
};


const emitTokenUpdate = async (doctorId) => {
  try {

    console.log("emitted", doctorId)
    const today = new Date().toISOString().split("T")[0];
    const tokenCounter = await TokenCounter.findOne({ doctorId, date: today });
    console.log(tokenCounter)

    if (tokenCounter) {
      io.to(`doctor_${doctorId}`).emit("tokenUpdate", { currentToken: tokenCounter.currentToken, doctorId: doctorId });
    }
  } catch (error) {
    console.error("Error emitting token update:", error);
  }
};

module.exports = { initializeSocket, emitTokenUpdate };
