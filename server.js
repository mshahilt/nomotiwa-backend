require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const hospitalRoutes = require("./router/hospitalRoutes");
const tokenManagementRoutes = require("./router/tokenManagementRoutes");
const { initializeSocket } = require("./socket.io/socket");

const app = express();
const server = http.createServer(app);

connectDB();app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/api/hospital", hospitalRoutes);
app.use("/api/token-management", tokenManagementRoutes);

initializeSocket(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
