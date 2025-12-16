const { web3, contract } = require("../config/web3");

const requireContract = () => {
  if (!contract) {
    throw new Error(
      "Smart contract not configured. Set CONTRACT_ADDRESS in backend/.env to the deployed contract address."
    );
  }
  return contract;
};

exports.storeAttestation = async (attestationHash) => {
  const contractInstance = requireContract();
  const accounts = await web3.eth.getAccounts();

  return contractInstance.methods
    .storeAttestation(attestationHash)
    .send({ from: accounts[0], gas: 100000 });
};

exports.verifyAttestation = async (attestationHash) => {
  const contractInstance = requireContract();
  return contractInstance.methods.exists(attestationHash).call();
};

exports.getTimestamp = async (attestationHash) => {
  const contractInstance = requireContract();
  return contractInstance.methods.getTimestamp(attestationHash).call();
};
