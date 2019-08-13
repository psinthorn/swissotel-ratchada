require("dotenv").config("./../../.env");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");
const puppeteer = require("puppeteer");

const BookingHotel = require("./../../models/BookingHotel");
const Transfer = require("./../../models/Transfer");
const Policy = require("./../../models/Policy");

module.exports = {
  //Booking Reservation Page
  eventBooking(req, res) {
    let promiseAll = [Transfer.find({}).exec(), Policy.find({}).exec()];
    Promise.all(promiseAll).then(([transfers, policy]) => {
      res.status(200).render("index/event-booking", {
        transfers: transfers,
        policy: policy
      });
    });
  },

  //Booking Reservation Page
  reservation(req, res) {
    let booking = req.body;

    //res.send(booking);
    BookingHotel.create(booking).then(booking => {
      const id = booking._id;
      const suffixTitle = booking.suffix;
      const fName = booking.fname;
      const lName = booking.lname;

      let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        //port: 25,
        secure: true,
        port: 465,
        //secure: false,
        auth: {
          // user: "reservations@bee-slc.com",
          // pass: "bee#$Slc"
          // user: "smtp@swissotelratchada.com",
          // pass: "yEm9_=!Ro_(V"
          user: process.env.SMTP_LOGIN,
          pass: process.env.SMTP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: '"Swissotel Bangkok Ratchada" <slc.reservations@Swissotel.com>',
        to: `${
          booking.email // sender address
        }`,
        subject:
          "Swissotel Booking Reservation Confirmation- SITA AERO ASIA PACIFIC",
        text: `Dear ${
          booking.suffix // Subject line
        } ${booking.fname} 

            Thank you for your reservation at Swissotel Bangkok Ratchada.           
            Please note, the Booking ID: ${
              booking._id
            }  is not your hotel booking confirmation.            
            You will receive a confirmation email within 2-3 working days to confirm your reservation. This email will include your seven-digit Confirmation Number.           
            If you do not hear from us within 3 working days, please contact SLC.Reservations@Swissotel.com with your Booking ID number.
            Thank you for reservation with Swissotel Bangkok Ratchada.
             `
      };

      let mailOptionsNotice = {
        from: '"Swissotel Bangkok Ratchada" <slc.reservations@Swissotel.com>',
        // to: `reservations@bee-slc.com`,
        to: `reservations@swissotelratchada.com`,
        subject: "Reservation Booking - SITA AERO ASIA PACIFIC",
        text: ` New reservation from https://reservation.swissotelratchada.com web apps., 
        
            *Booking Information*
            ______________________________________________________________________________
            - Booking ID: ${booking._id}
           
            - Customer Name: ${booking.suffix} ${booking.fname} ${booking.lname}
            - Company Name: ${booking.companyname}
            - Address: ${booking.addr}
            - Email: ${booking.email}
            - Phone: ${booking.phone}
            - Fax: ${booking.fax}
            - 
            
            []Rooms Type Selection:
            ____________________________________________________________________________
            - Swiss Premier Room Single: ${booking.spmrsingle} 
            - Swiss Premier Room Twin:    ${booking.spmrtwin}
            ----------------------------------------------------------------------------
            - Swiss Advantage Room Single: ${booking.sarssingle}
            - Swiss Advantage Room Twin: ${booking.sarstwin}
             ----------------------------------------------------------------------------
            - One Bed Suits Room Single: ${booking.obrssingle}
            - One Bed Suits Room Twin: ${booking.obrstwin}


            []Extra Bed: ${booking.xtrb}

            []Meeting Date Selection:
            ____________________________________________________________________________
            - 23 July 2019:    ${booking.meeting23} 
            - 24 July 2019:    ${booking.meeting24}
            - 25 July 2019:    ${booking.meeting25}
            - 26 July 2019:    ${booking.meeting26}
            ----------------------------------------------------------------------------
           
            []Special Request: 
            - ${booking.specialReq}

            ----------------------------------------------------------------------------

            Airport Transfers
            - Suvarnabhumi Airport - Hotel
               - Toyota Camry (max. 3 persons): ${
                 booking.camry5b9246247745312776fd4d76
               }
               - Toyota Commuter (max. 10 persons): ${
                 booking.minibus5b9246247745312776fd4d76
               }
             - Hotel - Suvarnabhumi Airport
               - Toyota Camry (max. 3 persons): ${
                 booking.camry5b9246307745312776fd4d77
               }
               - Toyota Commuter (max. 10 persons): ${
                 booking.minibus5b9246307745312776fd4d77
               }
            

            <-> Arrival and Departure Date and Time
            _____________________________________________________________________________
            - Arrival Date: ${booking.arvdate}
            - Flight No. ${booking.arvflight}
            - Arrival Time: ${booking.arvtime}
           
            - Departure Date: ${booking.dptdate}
            - Flight No. ${booking.dptflight}
            - Departure Time: ${booking.dpttime}

            $Payment Infomation
            _______________________________________________________________________________
            - Credit Card Company: ${booking.cccompany}
            - Credit Card No: ${booking.ccno}
            - Credit Card Expire: ${booking.ccexp}
            - Credit Card Holder Name: ${booking.ccname}
           
            Swissotel Bangkok Ratchada : Web Apps Online Booking
            Full reservation infomation: https://reservation.swissotelratchada.com/admin/bookings
        
             `
      };

      if (!booking.email) {
        //if no email address input run this
        transporter.sendMail(mailOptionsNotice, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      } else {
        //Sendmail notice to reservation
        transporter.sendMail(mailOptionsNotice, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });

        //Sendmail to customer
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      }

      // res.send(booking);
      res
        .status(200)
        .redirect(
          "/thank-you?id=" +
            id +
            "&suffixTitle=" +
            suffixTitle +
            "&fname=" +
            fName +
            "&lname=" +
            lName
        );
    });
  },

  //Booking lists
  bookingLists(req, res) {
    BookingHotel.find({ event: "sita-aero-2019" })
      .sort({ BookingTimeStamp: -1 })
      .then(bookings => {
        const total = bookings.length;

        res
          .status(200)
          .render("admin/booking-lists", { bookings: bookings, total: total });
      });
  },

  //Booking lists -> pdf
  bookingPdfTemplate(req, res) {
    BookingHotel.find({ event: "sita-aero-2019" })
      .sort({ BookingTimeStamp: -1 })
      .then(bookings => {
        res
          .status(200)
          .render("admin/booking-lists-pdf", { bookings: bookings });
      });
  },

  // Generate booking list as pdf

  bookingListsPdfGen(req, res) {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // As protection page we need to authorization from system
      // Navigate to login page for authorize
      await page.goto(`http://localhost:8000/admin/login`, {
        waitUntil: "networkidle0"
      });
      await page.type("#email", process.env.EMAIL);
      await page.type("#password", process.env.PASSWORD);
      await page.click("#submit");

      // End authorization

      // Navigate to page that need to create pdf
      await page.goto(`http://localhost:8000/admin/bookings-pdf-template`, {
        waitUntil: "networkidle2"
      });

      // #Save to server use this
      // const pdf = await page.pdf({
      //   path: `booking-info-${id}.pdf`,
      //   format: "A4"
      // });

      const pdf = await page.pdf({
        format: "A4",
        landscape: false,
        printBackground: true
      });

      await res.type("application/pdf");
      await res.send(pdf);

      await browser.close();
      // return pdf;
    })();
  },

  //ALl booking list
  booking(req, res, next) {
    BookingHotel.find({})
      .sort({ create_time: -1 })
      .then(bookings => {
        //res.send(bookings);
        res.render("bookings/index", { bookings: bookings });
      });
  },

  //Booking Detail
  showDetails(req, res, next) {
    const id = req.params.id;

    BookingHotel.find({ _id: id }).then(booking => {
      //Json Object for check status
      let roomsCheck = {};

      //Check rooms selection for Swiss Premier Room Sigle
      if (booking[0].spmrsingle == "on") {
        roomsCheck.spmrSingle = "checked";
      } else {
        roomsCheck.spmrSingle = " ";
      }

      //Check rooms selection for Swiss Premier Room Twin
      if (booking[0].spmrtwin == "on") {
        roomsCheck.spmrTwin = "checked";
      } else {
        roomsCheck.spmrTwin = " ";
      }

      roomsCheck.extraBed = booking[0].xtrb == "on" ? "checked" : " ";

      //res.send(booking);
      res.render("bookings/show", { booking: booking, roomsCheck: roomsCheck });
    });
  },

  delete(req, res) {
    const id = req.params.id;
    BookingHotel.findByIdAndRemove({ _id: id }).then(() => {
      res.status(200).redirect("/admin/bookings");
    });
  },

  delete(req, res) {
    const id = req.params.id;
    BookingHotel.findByIdAndRemove({ _id: id }).then(() => {
      res.status(200).redirect("/admin/bookings");
    });
  },

  //Booking info template
  pdftemplate(req, res, next) {
    const id = req.params.id;

    BookingHotel.find({ _id: id }).then(booking => {
      //Json Object for check status
      let roomsCheck = {};

      //Check rooms selection for Swiss Premier Room Sigle
      if (booking[0].spmrsingle == "on") {
        roomsCheck.spmrSingle = "checked";
      } else {
        roomsCheck.spmrSingle = " ";
      }

      //Check rooms selection for Swiss Premier Room Twin
      if (booking[0].spmrtwin == "on") {
        roomsCheck.spmrTwin = "checked";
      } else {
        roomsCheck.spmrTwin = " ";
      }

      roomsCheck.extraBed = booking[0].xtrb == "on" ? "checked" : " ";

      //res.send(booking);
      res.render("bookings/reservation-info", {
        booking: booking,
        roomsCheck: roomsCheck
      });
    });
  },

  pdf(req, res) {
    const id = req.params.id;

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // As protection page we need to authorization from system
      // Navigate to login page for authorize
      await page.goto(`http://localhost:8000/admin/login`, {
        waitUntil: "networkidle0"
      });
      await page.type("#email", process.env.EMAIL);
      await page.type("#password", process.env.PASSWORD);
      await page.click("#submit");

      // End authorization

      // Navigate to page that need to create pdf
      await page.goto(`http://localhost:8000/admin/reservation/info/${id}`, {
        waitUntil: "networkidle2"
      });

      // #Save to server use this
      // const pdf = await page.pdf({
      //   path: `booking-info-${id}.pdf`,
      //   format: "A4"
      // });

      const pdf = await page.pdf({
        format: "A4",
        landscape: false
      });

      await res.type("application/pdf");
      await res.send(pdf);

      await browser.close();
      // return pdf;
    })();

    //res.redirect(`http://localhost:8000/admin/reservation/views/${id}`);
  }
};
