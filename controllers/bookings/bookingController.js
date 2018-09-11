const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');

const BookingHotel = require('./../../models/BookingHotel');
const Transfer = require('./../../models/Transfer');
const Policy = require('./../../models/Policy');


module.exports = {


//Booking Reservation Page
eventBooking(req, res){
    
        let promiseAll = [
            Transfer.find({}).exec(),
            Policy.find({}).exec(),

        ]       
        Promise.all(promiseAll)
        .then(([transfers, policy]) => {
            res.status(200).render('index/event-booking', { transfers: transfers, policy: policy } );
        });

        
    },


//Booking Reservation Page
reservation(req, res){

    let booking = req.body;
    //res.send(booking);
    BookingHotel.create(booking)
    .then( booking => {
        const id = booking._id;
        const fName = booking.fname;
        const lName = booking.lname

        let transporter = nodeMailer.createTransport({
            host: 'mail.directbooking.co.th',
            port: 25,
            secure: false,
            auth: {
                user: 'sinthorn@directbooking.co.th',
                pass: '1978#$Life'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: '"Swissotel Le Concorde Bangkok" <slc.reservations@Swissotel.com>', // sender address
            //to: req.body.to, // list of receivers
            //to: toEmail,
            //to: 'seaflyers@hotmail.com',
            to: `${ booking.email }`,
            subject: 'Swissotel Le Concorde Bangkok Confirmed Reservation' , // Subject line
            text: `Dear ${ booking.fname  } 

            Thank you for reservation with Swissotel Le Concorde Bankok.
            
            *Your Booking Information*
            Booking.ID: ${ booking._id}
           
            
            Arrival Date: ${ booking.arvdate }
            Flight No. ${ booking.arvflight }
            Arrival Time: ${ booking.arvtime}
           
            Departure Date: ${ booking.dptdate }
            Flight No. ${ booking.dptflight }
            Departure Time: ${ booking.dpttime}
           
           
            Have a Good Trip :)
            Swissotel Le Concorde Bangkok

             `, // plain text body
            //html: '<b>NodeJS Email Tutorial</b>' // html body
        };

        //customer name on paypal
        //Customer Name:  ${ payment.payer.payer_info.first_name  } 

        let mailOptionsNotice = {
            from: '"Swissotel Le Concorde Bangkok" <slc.reservations@Swissotel.com>', // sender address
            to: `psinthorn@gmail.com`,
           
            subject: 'New Reservation Confirmed' , // Subject line
            text: `
            New reservation from https://reservation.bee-slc.com web apps.
            
            *Booking Information*
            Booking.ID: ${ booking._id}
           
            Customer Name: ${ booking.fname } ${ booking.lname }
            
            Arrival Date: ${ booking.arvdate }
            Flight No. ${ booking.arvflight }
            Arrival Time: ${ booking.arvtime}
           
            Departure Date: ${ booking.dptdate }
            Flight No. ${ booking.dptflight }
            Departure Time: ${ booking.dpttime}
           
           
            Swissotel Le Concorde Bangkok : Web Apps Online Booking
            Full reservation infomation: https://reservation.bee-slc.com/admin/bookings
        
             `, // plain text body
            //html: '<b>NodeJS Email Tutorial</b>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

        });

        transporter.sendMail(mailOptionsNotice, (error, info) => {
            if (error) {
                return console.log(error);
            }

        });

       // res.send(booking);
        res.status(200).redirect('/thank-you?id='+ id + '&fname='+ fName + '&lname='+ lName);
    });
    
    },


 //Booking lists   
 bookingLists(req, res){
    
        BookingHotel.find({}).sort({ bookingTimeStamp: -1})
        .then( bookings => {
            res.status(200).render("admin/booking-lists", { bookings: bookings });
        });
        
    },


   
    //ALl booking list
    booking(req, res, next){
        BookingHotel.find({}).sort({'create_time': -1 })
        .then( bookings => {
            //res.send(bookings);
            res.render('bookings/index',{ bookings: bookings } );
        });
    },

    //Booking Detail
    showDetails(req, res, next){

        const id = req.params.id;

        BookingHotel.find({_id: id })
        .then( booking => {
            //res.send(booking);
            res.render('bookings/show',{ booking: booking } );
        });
    },

}







