const fs = require("fs");
const path = require("path");
const hashService = require("../services/hash.service");
const attestationService = require("../services/attestation.service");
const signingService = require("../services/signing.service");
const attestationStore = require("../services/attestation.store");
const fileType = require("file-type");
const crypto = require("crypto");
const blockchainService = require("../services/blockchain.service");
const phashRegistry = require("../services/phash.registry");

// TEMP key store (later DB / wallet)
const userKeys = {};

// Upload and register image
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const diskPath = req.file.path;

    // Validate actual file type using magic bytes.
    // With memoryStorage, multer provides `req.file.buffer` and `req.file.path` is undefined.
    // With diskStorage, multer provides `req.file.path` and `req.file.buffer` is undefined.
    const buffer = req.file.buffer ?? (diskPath ? fs.readFileSync(diskPath) : null);
    if (!buffer) {
      return res.status(400).json({ message: "Invalid upload: missing file buffer" });
    }

    const detectedType = await fileType.fromBuffer(buffer);

    if (!detectedType || !["image/jpeg", "image/png"].includes(detectedType.mime)) {
      try {
        if (diskPath) fs.unlinkSync(diskPath);
      } catch (_) {}
      return res.status(400).json({ message: "Invalid image type" });
    }

    // `image-hash` needs a file path, so when using memoryStorage we write a temporary file.
    let workingPath = diskPath;
    let wroteTempFile = false;
    if (!workingPath) {
      const uploadsDir = path.join(__dirname, "..", "uploads");
      fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(req.file.originalname || "") || ".bin";
      workingPath = path.join(
        uploadsDir,
        `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
      );
      fs.writeFileSync(workingPath, buffer);
      wroteTempFile = true;
    }

    // 1. Generate hashes
    const sha256 = hashService.sha256(workingPath);
    const pHash = await hashService.pHash(workingPath);

    // 2. Generate signing key if not exists
    if (!userKeys[userId]) {
      userKeys[userId] = signingService.generateKeyPair();
    }

    const { publicKey, privateKey } = userKeys[userId];

    // 3. Create attestation
    const { attestation, canonical } =
      attestationService.createAttestation({
        imageHash: sha256,
        pHash,
        userId,
        metadata: {
          filename: req.file.originalname,
          size: req.file.size
        }
      });

    // 4. Sign attestation
    const signature = signingService.sign(canonical, privateKey);

    // 5. Hash attestation JSON
    const attestationHash = crypto
      .createHash("sha256")
      .update(canonical)
      .digest("hex");

    attestation.attestationHash = attestationHash;
    attestationStore.save(attestation);

    phashRegistry.add({
      attestationHash,
      pHash,
      signer: `user:${userId}`
    });

    // 6. Store on blockchain
    await blockchainService.storeAttestation("0x" + attestationHash);

    // 7. Cleanup image
    try {
      if (wroteTempFile && workingPath) fs.unlinkSync(workingPath);
      if (!wroteTempFile && diskPath) fs.unlinkSync(diskPath);
    } catch (_) {}

    res.json({
      attestation,
      signature,
      publicKey,
      attestationHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadImage = exports.upload;


// Get image by ID
exports.getImage = async (req, res) => {
  try {
    // TODO: Implement image retrieval
    res.status(200).json({ message: "Get image endpoint" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
