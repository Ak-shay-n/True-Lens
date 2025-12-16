const fs = require("fs");
const crypto = require("crypto");
const os = require("os");
const path = require("path");
const hashService = require("../services/hash.service");
const blockchainService = require("../services/blockchain.service");
const forensicService = require("../services/forensic.service");

const PHASH_THRESHOLD = 10; // lower = more similar

const hammingDistance = (a, b) => {
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++;
  }
  return dist;
};

exports.verifyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = req.file.buffer
      ? req.file.buffer
      : req.file.path
        ? fs.readFileSync(req.file.path)
        : null;

    if (!buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Compute hashes
    const sha256 = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");

    let tempFilePath = null;
    try {
      const filePathForHash = req.file.path
        ? req.file.path
        : (() => {
          tempFilePath = path.join(
            os.tmpdir(),
            `true-lens-verify-${Date.now()}-${Math.round(Math.random() * 1e9)}.bin`
          );
          fs.writeFileSync(tempFilePath, buffer);
          return tempFilePath;
        })();

      const pHash = await hashService.pHash(filePathForHash);

      // 2. Blockchain verification
      const exists = await blockchainService.verifyAttestation("0x" + sha256);

      // 3. Forensics
      const exif = forensicService.extractExif(buffer);
      const aiFlags = await forensicService.basicAiHeuristics(buffer);

      // 4. Cleanup
      if (req.file.path) {
        setTimeout(() => {
          fs.unlink(req.file.path, () => {});
        }, 1000);
      }
      if (tempFilePath) {
        setTimeout(() => {
          fs.unlink(tempFilePath, () => {});
        }, 1000);
      }

      // 5. Verdict
      let verdict = {
        status: "NOT_VERIFIED",
        confidence: "LOW",
        reason: []
      };

      if (exists) {
        verdict.status = "VERIFIED";
        verdict.confidence = "VERY_HIGH";
        verdict.reason.push("Exact blockchain match");
      } else {
        verdict.reason.push("No exact blockchain match");
      }

      if (aiFlags.length > 0) {
        verdict.reason.push(...aiFlags);
      }

      return res.json({
        sha256,
        pHash,
        blockchainMatch: exists,
        exifPresent: !!exif,
        aiFlags,
        verdict
      });
    } finally {
      // If anything threw before scheduled cleanup, best-effort immediate cleanup.
      if (tempFilePath) {
        try { fs.unlinkSync(tempFilePath); } catch (_) {}
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
