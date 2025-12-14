const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/image", imageRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "TrueLens Backend Running" });
});

module.exports = app;