const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const aws = require('aws-sdk');
const paypal = require('paypal-rest-sdk');



//const multer = require('multer');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const keys  = require('./config/key');
const upload = require('express-fileupload');
const flash = require('connect-flash');

//load user model
require('./models/Category');
require('./models/Contents');
require('./models/Users');
require('./models/Apartment');
require('./models/Contact');
require('./models/About');
require('./models/Facility');
require('./models/UserAdmin');
require('./models/ApartmentIntro');
require('./models/ApartmentIntro');
require('./models/Slide');
require('./models/Transfer')
require('./models/TourCategory');
require('./models/Policy');


//load router
const admin = require('./routes/admin');
const reservations = require('./routes/reservations')
const auth = require('./routes/auth'); 
const mail = require('./routes/mail');
const contents = require('./routes/content');
const index = require('./routes/index');
const contact = require('./routes/contact');
const about = require('./routes/about');
const intro      = require('./routes/Intro');
const tour = require('./routes/tour');
const slide = require('./routes/slide');
const transfer = require('./routes/transfers');
const tourcategory = require('./routes/tourCategory');
const payment = require('./routes/payment');
const booking = require('./routes/booking');
const policy = require('./routes/policy');

const app = express();


//use sessions for tracking logins
app.use(session({
    secret: 'swissotel',
    resave: true,
    saveUninitialized: false
  }));

//connect-flash middleware
app.use(flash());

//global variable
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Load config
require('./config/passport')(passport);

//map global promise 
//if not map this promise you will get some error warning when connect to mongoDB 
mongoose.Promise = global.Promise;

//MongoDB connect
mongoose.connect(keys.mongoURI, {
//    useMongoClient: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err) );


aws.config.region = 'eu-west-1';

/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;

//Paypal Config
paypal.configure({
   
    'mode': 'sandbox', //sandbox or live
    //Pornchai Transport and Tours
    'client_id': 'AS7LnARWBmHwFlFf5O9_n6', //seaflyers
    'client_secret': 'EF-cGaliGY6pQxHK_GO4kxUAQkgkwbMdL5sBwLFJZEg-D' //seaflyers

});

//method-override middle-ware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//body-parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Handlebars Helpers
const { truncate, stripTags, formatDate, select} = require('./helpers/hbs');

//Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// //express-session and cookie-parser
// app.use(cookieParser());
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }));


//set user to global use
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


//express-fileupload
app.use(upload());

//set static folder public
app.use(express.static(path.join(__dirname, 'public')));

//use route
admin(app);
index(app);
contact(app);
about(app);
tour(app);
slide(app);
intro(app);
transfer(app);
tourcategory(app);
payment(app);
booking(app);
policy(app);

module.exports = app;

