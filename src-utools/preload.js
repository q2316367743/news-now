const {openFile, downloadFileFromUrl, downloadFile} = require('./src/common');
const {hash, md5, encodeBase64, transferToUtf8} = require('./src/format');
const axios = require("axios");


window.preload = {
  openFile, downloadFileFromUrl, downloadFile,
  axios: axios.create({
    timeout: 15000,
    adapter: 'http'
  }),
  util: {
    crypto: {
      encodeBase64, md5, hash
    },
    iconv: {
      transferToUtf8
    }
  }
}