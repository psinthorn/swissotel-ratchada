const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const About = require('../models/About');
const Apartment = require('../models/Apartment');
const Tour = require('../models/Tour');
const Intro = require('../models/Intro');
const Transfer = require('./../models/Transfer');
const TourCategory = require('./../models/TourCategory');
const Policy = require('./../models/Policy');
const BookingHotel = require('./../models/BookingHotel');


module.exports = {




index(req, res){

    let promisesAll = [

        Tour.find({status: 'Public'}).sort({ date: -1}).exec(),
        Intro.find({ status: 'Public'}).exec(),
        Contact.find({}).exec()

    ];

    Promise.all(promisesAll)
    .then( ([tours, intro, contact]) => {
            res.render('index/welcome', { tours: tours, intro: intro, contact });          
    });
    
}, 

//Booking Reservation Page
eventBooking(req, res){
    
        let promiseAll = [
            Policy.find({}).exec(),
            Transfer.find({}).exec(),
        ]
        
        Promise.all(promiseAll)
        .then(([policy, transfers]) => {
            res.status(200).render('index/event-booking', { policy: policy, transfers: transfers  } );
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


//Thank you 
thankYou(req, res){
    const id = req.query.id;
    const lname = req.query.lname;
    const fname = req.query.fname;

    res.render('index/thank-you', {id: id, lname: lname, fname: fname});
},

about(req, res){
    About.findOne({})
        .then( about => {
            res.render('index/about', { about: about });
        })  
},

tours(req, res){

    Tour.find({status: 'Public'}).sort({ date: -1})
    .then( (tours) => {
            res.render('index/tours', { tours: tours });          
    });
   
},

tourShow(req, res){

    const id = req.params.id;
    
        Tour.findById({ _id: id })
            .populate('subcontact')
            .then( tour => {
                res.render('index/tour-show', { tour: tour });   
            }); 
    },

 transfer(req, res) {

    let promisesAll = [
        
                Transfer.find({status: 'public'}).sort({from: 1}).exec(),
                TourCategory.find({status: 'Public'}).sort({ date: 1}).exec(),  
            ];
        
            Promise.all(promisesAll)
            .then(([transfers, tourCategories]) => {
                //res.send(tourCategories);
                res.render('index/transfers', {transfers: transfers, tourCategories: tourCategories });
                
            });    
 },  


 bookTransfer(req, res) {

    const price = req.query.price;
    const type = req.query.type;
    const id = req.params.id;
    const trFrom = req.query.from; 
    const trTo = req.query.to;

    const transfer = {
       'from': req.query.from,
       'to': req.query.to,
       'price': req.query.price,
       'type': req.query.type,
    }
    //res.send(trDetail);
    res.render('index/book-transfer', { transfer: transfer });

 }, 

 termPolicy(req, res){

    Policy.find({})
    .then(policy => {
        res.render('index/term-policies', {policy: policy });
    });
 },


contact(req, res){

    Contact.findOne({})
        .then( contact => {
            res.render('index/contact-us', { contact: contact });
        });
    
},




maps(req, res){

    res.render('index/maps');

},


geocode(req, res){
    res.render('index/geocode');
}


}