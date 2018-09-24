const mongoose = require('mongoose');

const Contact = require('../models/Contact');
const About = require('../models/About');
const Policy = require('./../models/Policy');
//const Transfer = require('./../models/Transfer');



module.exports = {


index(req, res){

    let promisesAll = [

        // Tour.find({status: 'Public'}).sort({ date: -1}).exec(),
        // Intro.find({ status: 'Public'}).exec(),
        Contact.find({}).exec()
    ];

    Promise.all(promisesAll)
    .then( ([
        //tours, 
        //intro, 
        contact]) => {
            res.render('index/welcome', 
            { 
                //tours: tours, 
                //intro: intro, 
                contact: contact });          
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