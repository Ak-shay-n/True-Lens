// In-memory pHash registry
const phashRegistry = [];

exports.add = ({ attestationHash, pHash, signer }) => {
  phashRegistry.push({
    attestationHash,
    pHash,
    signer
  });
};

exports.getAll = () => phashRegistry;
