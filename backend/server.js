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

const roomInquiryRoutes = require("./routes/roomInquiryRoutes");
const accommodation = require("./routes/accommodationRoutes");
const cleaning = require("./routes/cleaningRoutes");
const medical = require("./routes/medicalRoutes");
const clearance = require("./routes/clearanceRoutes");
const leave = require("./routes/leaveRoutes");
const user = require("./routes/userRoutes");
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const roomRoutes = require('./routes/roomRoutes');





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
