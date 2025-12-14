const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");

exports.generateKeyPair = () => {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey)
  };
};

exports.sign = (message, privateKeyBase64) => {
  const privateKey = naclUtil.decodeBase64(privateKeyBase64);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageUint8, privateKey);
  return naclUtil.encodeBase64(signature);
};

exports.verify = (message, signatureBase64, publicKeyBase64) => {
  const signature = naclUtil.decodeBase64(signatureBase64);
  const publicKey = naclUtil.decodeBase64(publicKeyBase64);
  const messageUint8 = naclUtil.decodeUTF8(message);
  return nacl.sign.detached.verify(messageUint8, signature, publicKey);
};
