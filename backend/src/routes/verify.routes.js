const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/verify.controller");
const uploadMiddleware = require("../middleware/upload.middleware");

// POST /api/verify
router.post(
  "/",
  uploadMiddleware.single("image"),
  verifyController.verifyImage
);

module.exports = router;
