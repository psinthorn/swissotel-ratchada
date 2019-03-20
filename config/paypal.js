const paypal = require("paypal-rest-sdk");

const paypalPayment = paypal.configure({
  mode: "sandbox", //sandbox or live

  client_id: "aaa",
  client_secret: "bbb"
});

module.exports = paypalPayment;
