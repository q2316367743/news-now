const crypto = require("crypto");
const iconv = require("iconv-lite");

function hash(s, algorithm) {
  return crypto.createHash(algorithm).update(s).digest("hex");
}

function md5(value) {
  return hash(value, "md5");
}

function encodeBase64(value) {
  return Buffer.from(value).toString("base64");
}

module.exports = {
  hash,
  md5,
  encodeBase64,
};
