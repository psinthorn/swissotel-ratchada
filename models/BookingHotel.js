const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingHotelSchema = new Schema({
  spmrsingle: {
    type: String,
    default: "off"
  },

  spmrtwin: {
    type: String,
    default: "off"
  },
  obrssingle: {
    type: String,
    default: "off"
  },
  obrstwin: {
    type: String,
    default: "off"
  },
  sarssingle: {
    type: String,
    default: "off"
  },
  sarstwin: {
    type: String,
    default: "off"
  },
  exctsingle: {
    type: String,
    default: "off"
  },
  excttwin: {
    type: String,
    default: "off"
  },
  xtrb: {
    type: String,
    default: "off"
  },
  specialReq: {
    type: String
  },
  meeting23: {
    type: String,
    default: "off"
  },
  meeting24: {
    type: String,
    default: "off"
  },
  meeting25: {
    type: String,
    default: "off"
  },
  meeting26: {
    type: String,
    default: "off"
  },
  camry5b9246247745312776fd4d76: {
    type: String,
    default: "off"
  },
  minibus5b9246247745312776fd4d76: {
    type: String,
    default: "off"
  },
  camry5b9246307745312776fd4d77: {
    type: String,
    default: "off"
  },
  minibus5b9246307745312776fd4d77: {
    type: String,
    default: "off"
  },
  suffix: {
    type: String
  },
  fname: {
    type: String
  },
  lname: {
    type: String
  },
  companyname: {
    type: String
  },
  addr: {
    type: String
  },
  phone: {
    type: String
  },
  fax: {
    type: String
  },
  email: {
    type: String
  },
  arvdate: {
    type: String
  },
  arvflight: {
    type: String
  },
  arvtime: {
    type: String
  },
  dptdate: {
    type: String
  },
  dptflight: {
    type: String
  },
  dpttime: {
    type: String
  },
  readPolicy: {
    type: String,
    default: "off"
  },
  status: {
    type: String
    // default: "Pending"
  },
  BookingTimeStamp: {
    type: String,
    default: Date.now
  },

  cccompany: {
    type: String
  },
  ccno: {
    type: String
  },
  ccexp: {
    type: String
  },
  ccname: {
    type: String
  },
  event: {
    type: String,
    default: "sita-aero-2019"
  }
});

const BookingHotel = mongoose.model("booking", BookingHotelSchema, "bookings");
module.exports = BookingHotel;
