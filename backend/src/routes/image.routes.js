const express = require("express");
const router = express.Router();
const imageController = require("../controllers/image.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");

// POST /api/images/upload
router.post(
  "/upload",
  authMiddleware,
  uploadMiddleware.single("image"),
  imageController.upload
);

// GET /api/images/:id
router.get("/:id", imageController.getImage);

module.exports = router;
