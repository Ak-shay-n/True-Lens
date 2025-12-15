const { Web3 } = require("web3");
const contractABI = require("../../../blockchain/build/contracts/ImageRegistry.json");

const web3 = new Web3("http://127.0.0.1:7545");

const contractAddress = "0x724de374cc140102B9714B7D3467C6Cba3189A07";

const contract = new web3.eth.Contract(
  contractABI.abi,
  contractAddress
);

module.exports = { web3, contract };
