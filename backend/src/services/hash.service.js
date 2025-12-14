const crypto = require("crypto");
const fs = require("fs");
const sharp = require("sharp");

exports.sha256 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

// Perceptual hash implementation (dHash).
// Returns a stable 64-bit hash as a 16-char hex string.
exports.pHash = async (filePath) => {
  const { data } = await sharp(filePath)
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Compare each pixel with its neighbor to the right.
  // 8 rows * 8 comparisons = 64 bits
  const bits = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const left = data[row * 9 + col];
      const right = data[row * 9 + col + 1];
      bits.push(left < right ? 1 : 0);
    }
  }

  // Pack bits into hex
  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    const nibble = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hex += nibble.toString(16);
  }

  return hex;
};
