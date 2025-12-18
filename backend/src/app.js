console.log("📦 app.js loaded");
const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");
const verifyRoutes = require("./routes/verify.routes");

const logRouterRoutes = (basePath, router) => {
  if (!router || !Array.isArray(router.stack)) return;
  router.stack.forEach((layer) => {
    if (!layer.route) return;
    const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
    console.log(methods, `${basePath}${layer.route.path}`);
  });
};

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
logRouterRoutes("/api/image", imageRoutes);
logRouterRoutes("/api/auth", authRoutes);
logRouterRoutes("/api/verify", verifyRoutes);

module.exports = app;