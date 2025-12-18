const fs = require("fs");
const crypto = require("crypto");
const os = require("os");
const path = require("path");
const hashService = require("../services/hash.service");
const blockchainService = require("../services/blockchain.service");
const forensicService = require("../services/forensic.service");
const attestationStore = require("../services/attestation.store");
const phashRegistry = require("../services/phash.registry");
const { hammingDistance } = require("../utils/phash.util");

const PHASH_THRESHOLD = 10; // lower = more similar

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

      let verdict = {
        status: "NOT_VERIFIED",
        confidence: "LOW",
        reason: []
      };

      // 2. Blockchain verification
      // 1. Try exact image hash match
      const attestation = attestationStore.findByImageHash(sha256);

      if (attestation) {
        const exists = await blockchainService.verifyAttestation(
          "0x" + attestation.attestationHash
        );

        if (exists) {
          verdict.status = "VERIFIED";
          verdict.confidence = "VERY_HIGH";
          verdict.reason.push("Exact blockchain attestation match");

          return res.json({
            sha256,
            pHash,
            blockchainMatch: true,
            verdict
          });
        }
      }

      // After exact-match check, keep PROBABLE_MATCH logic based on pHash.
      const probable = attestationStore.findByPHash(pHash);

      // 3. Perceptual similarity check
      let probableMatch = null;
      if (probable) {
        verdict.status = "PROBABLE_MATCH";
        verdict.confidence = "MEDIUM_HIGH";
        verdict.reason.push("Perceptual similarity detected");
        probableMatch = {
          attestationHash: probable.attestationHash,
          signer: probable.signer,
          distance: 0
        };
      } else {
        const registry = phashRegistry.getAll();

        for (const record of registry) {
          const distance = hammingDistance(pHash, record.pHash);

          if (distance <= PHASH_THRESHOLD) {
            probableMatch = {
              attestationHash: record.attestationHash,
              signer: record.signer,
              distance
            };
            break;
          }
        }
      }

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
      if (verdict.status === "NOT_VERIFIED") {
        if (probableMatch) {
          verdict.status = "PROBABLE_MATCH";
          verdict.confidence = "MEDIUM_HIGH";
          verdict.reason.push("Perceptual similarity detected");
        } else {
          verdict.reason.push("No exact blockchain match");
        }
      }

      if (aiFlags.length > 0) {
        verdict.reason.push(...aiFlags);
      }

      return res.json({
        sha256,
        pHash,
        blockchainMatch: false,
        probableMatch,
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
