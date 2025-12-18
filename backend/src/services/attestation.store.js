const attestations = [];

exports.save = (attestation) => {
  attestations.push(attestation);
};

exports.findByImageHash = (imageHash) => {
  return attestations.find(a => a.imageHash === imageHash);
};

exports.findByPHash = (pHash) => {
  return attestations.find(a => a.pHash === pHash);
};
