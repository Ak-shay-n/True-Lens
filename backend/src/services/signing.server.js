const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

exports.generateKeyPair = () => {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey)
  };
};

exports.sign = (message, privateKeyBase64) => {
  const messageUint8 = util.decodeUTF8(message);
  const privateKeyUint8 = util.decodeBase64(privateKeyBase64);

  const signature = nacl.sign.detached(messageUint8, privateKeyUint8);
  return util.encodeBase64(signature);
};

exports.verify = (message, signatureBase64, publicKeyBase64) => {
  const messageUint8 = util.decodeUTF8(message);
  const signatureUint8 = util.decodeBase64(signatureBase64);
  const publicKeyUint8 = util.decodeBase64(publicKeyBase64);

  return nacl.sign.detached.verify(
    messageUint8,
    signatureUint8,
    publicKeyUint8
  );
};
