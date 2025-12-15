const { web3, contract } = require("../config/web3");

exports.storeAttestation = async (attestationHash) => {
  const accounts = await web3.eth.getAccounts();

  return contract.methods
    .storeAttestation(attestationHash)
    .send({ from: accounts[0], gas: 100000 });
};

exports.verifyAttestation = async (attestationHash) => {
  return contract.methods.exists(attestationHash).call();
};

exports.getTimestamp = async (attestationHash) => {
  return contract.methods.getTimestamp(attestationHash).call();
};
