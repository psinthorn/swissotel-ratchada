const BookingController = require('./../controllers/bookings/bookingController');
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');

module.exports = (app) => {

   
    //Reservation landing page
    app.get('/', BookingController.eventBooking);
  
    //Reservation post process
    app.post('/reservation', BookingController.reservation);
  
    //All Booking Lists
    app.get('/admin/bookings',ensureAuthenticated, BookingController.bookingLists );


    app.get('/bookings', BookingController.booking);
    
    app.get('/admin/reservation/views/:id',ensureAuthenticated, BookingController.showDetails);



}



