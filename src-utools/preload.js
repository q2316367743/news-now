const crypto = require("./src/crypto");
const iconv = require("./src/iconv");
const axios = require("axios");

window.preload = {
  axios: axios.create({
    timeout: 15000,
    adapter: "http",
  }),
  util: {
    crypto: crypto,
    iconv: iconv,
  },
};
