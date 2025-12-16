require("dotenv").config();
const Web3 = require("web3");
const abi = require("./contractABI.json");

const web3 = new Web3(process.env.GANACHE_URL);

const contract = new web3.eth.Contract(
  abi,
  process.env.CONTRACT_ADDRESS
);

module.exports = { web3, contract };
