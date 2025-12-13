const crypto = require("crypto");
const { imageHash } = require("image-hash");
const fs = require("fs");

exports.sha256 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

exports.pHash = (filePath) => {
  return new Promise((resolve, reject) => {
    imageHash(filePath, 16, true, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};
