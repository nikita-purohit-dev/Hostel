const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5111;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./config/db");
connectDB();

const roomInquiryRoutes = require("./roomInquiryRoutes");
const accommodation = require("./accommodationRoutes");
const cleaning = require("./cleaningRoutes");
const medical = require("./medicalRoutes");
const clearance = require("./clearanceRoutes");
const leave = require("./leaveRoutes");
const user = require("./userRoutes");
const adminRoutes = require('./adminRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const roomRoutes = require('./roomRoutes');





app.use("/api/inquiries", roomInquiryRoutes);
app.use("/api/accommodation", accommodation);
app.use("/api/cleaning", cleaning);
app.use("/api/medical", medical);
app.use("/api/clearance", clearance);

app.use("/api/leave", leave);
app.use("/api/user", user);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/rooms', roomRoutes);


const server = app.listen(port, () =>
  console.log(`Server running on port ${port} 🔥`)
);
