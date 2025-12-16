console.log("📦 app.js loaded");
const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");
const verifyRoutes = require("./routes/verify.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/image", imageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);

app.get("/", (req, res) => {
  res.json({ status: "TrueLens Backend Running" });
});

console.log("🔍 Registered routes:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      Object.keys(layer.route.methods).join(",").toUpperCase(),
      layer.route.path
    );
  } else if (layer.name === "router") {
    layer.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(
          Object.keys(handler.route.methods).join(",").toUpperCase(),
          "/api/verify" + handler.route.path
        );
      }
    });
  }
});

module.exports = app;