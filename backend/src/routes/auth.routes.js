const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/jwt-test
router.get("/jwt-test", auth, (req, res) => {
  res.json({
    message: "JWT is valid",
    user: req.user
  });
});

module.exports = router;
