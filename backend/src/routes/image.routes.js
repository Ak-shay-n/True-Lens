const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage()
});
const auth = require("../middleware/auth.middleware");
const imageController = require("../controllers/image.controller");

router.post(
  "/upload",
  auth,
  upload.single("image"),
  imageController.upload
);

// GET /api/images/:id
router.get("/:id", imageController.getImage);

module.exports = router;
