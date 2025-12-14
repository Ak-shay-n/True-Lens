const canonicalize = require("canonicalize");

exports.createAttestation = ({
  imageHash,
  pHash,
  userId,
  metadata
}) => {
  const attestation = {
    version: "1.0",
    type: "ImageAuthenticityAttestation",
    imageHash,
    pHash,
    signer: `user:${userId}`,
    timestamp: new Date().toISOString(),
    metadata
  };

  const canonical = canonicalize(attestation);

  return {
    attestation,
    canonical
  };
};
