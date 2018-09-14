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
            //port: 25,
            secure: true,
            port: 465,
            //secure: false,
            auth: {
                user: 'reservations@bee-slc.com',
                pass: 'bee#$Slc'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: '"Swissotel Bangkok Ratchada" <slc.reservations@Swissotel.com>', // sender address
            //to: req.body.to, // list of receivers
            //to: toEmail,
            //to: 'seaflyers@hotmail.com',
            to: `${ booking.email }`,
            subject: 'Booking VIAVI RSU APAC' , // Subject line
            text: `Dear ${ booking.fname  } 

            Thank you for reservation with Swissotel Bangkok Ratchada.
            
            *Your Booking Information*
            Booking ID: ${ booking._id}
           
            Swissotel Bangkok Ratchada

             `, // plain text body
            //html: '<b>NodeJS Email Tutorial</b>' // html body


            // Arrival Date: ${ booking.arvdate }
            // Flight No. ${ booking.arvflight }
            // Arrival Time: ${ booking.arvtime}
           
            // Departure Date: ${ booking.dptdate }
            // Flight No. ${ booking.dptflight }
            // Departure Time: ${ booking.dpttime}
        };

        //customer name on paypal
        //Customer Name:  ${ payment.payer.payer_info.first_name  } 

        let mailOptionsNotice = {
            from: '"Swissotel Bangkok Ratchada" <slc.reservations@Swissotel.com>', // sender address
            to: `reservations@bee-slc.com`,
           
            subject: 'New Booking VIAVI RSU APAC' , // Subject line
            text: ` New reservation from https://reservation.bee-slc.com web apps.
            
            *Booking Information*
            ______________________________________________________________________________
            - Booking ID: ${ booking._id}
           
            - Customer Name: ${ booking.fname } ${ booking.lname }
            - Company Name: ${ booking.companyname}
            - Address: ${ booking.addr}
            - Email: ${ booking.email }
            - Phone: ${ booking.phone }
            - Fax: ${ booking.fax }
            - 
            
            []Rooms Type Selection:
            ____________________________________________________________________________
            - Swiss Premier Room Single: ${ booking.spmrsingle } 
            - Swiss Premier Room Twin:    ${ booking.spmrtwin }

            []Extra Bed: ${ booking.xtrb}

            Airport Transfers
            

            <-> Arrival and Departure Date and Time
            _____________________________________________________________________________
            - Arrival Date: ${ booking.arvdate }
            - Flight No. ${ booking.arvflight }
            - Arrival Time: ${ booking.arvtime}
           
            - Departure Date: ${ booking.dptdate }
            - Flight No. ${ booking.dptflight }
            - Departure Time: ${ booking.dpttime}

            $Payment Infomation
            _______________________________________________________________________________
            - Credit Card Company: ${ booking.cccompany }
            - Credit Card No: ${ booking.ccno }
            - Credit Card Expire: ${ booking.ccexp }
            - Credit Card Holder Name: ${ booking.ccname }
           
            Swissotel Bangkok Ratchada : Web Apps Online Booking
            Full reservation infomation: https://reservation.bee-slc.com/admin/bookings
        
             `, // plain text body
            //html: '<b>NodeJS Email Tutorial</b>' // html body
        };

        if(!booking.email){

            //if no email address input run this 
            transporter.sendMail(mailOptionsNotice, (error, info) => {
                if (error) {
                    return console.log(error);
                }
    
            });
        }else{
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
        res.status(200).redirect('/thank-you?id='+ id + '&fname='+ fName + '&lname='+ lName);
    });
    
    },


 //Booking lists   
 bookingLists(req, res){
    
        BookingHotel.find({}).sort({ BookingTimeStamp: -1})
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

            //Json Object for check status
            let roomsCheck = {} ;
           
            //Check rooms selection for Swiss Premier Room Sigle
            if( booking[0].spmrsingle == "on"){
                roomsCheck.spmrSingle = "checked"

            }else{
                roomsCheck.spmrSingle = " "
                             
            }
            
            //Check rooms selection for Swiss Premier Room Twin
            if( booking[0].spmrtwin == "on"){
                roomsCheck.spmrTwin = "checked"  

            }else{
                
                roomsCheck.spmrTwin = " "
            }

            roomsCheck.extraBed = booking[0].xtrb == "on" ? "checked" : " ";

            //res.send(booking);
            res.render('bookings/show',{ booking: booking, roomsCheck: roomsCheck } );
        });
    },

    delete(req, res){
        const id = req.params.id;
        BookingHotel.findByIdAndRemove({ _id: id })
        .then( () => {
            res.status(200).redirect('/admin/bookings');
        })
    },

}







