const BookingController = require('./../controllers/bookings/bookingController');
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');

module.exports = (app) => {

   
    //Reservation landing page
    app.get('/', BookingController.eventBooking);
  
    //Reservation post process
    app.post('/reservation', BookingController.reservation);
  
    //All Booking Lists
    app.get('/admin/bookings',ensureAuthenticated, BookingController.bookingLists );

    app.get('/admin/reservation/views/:id',ensureAuthenticated, BookingController.showDetails);

    //Delete reservation 
    app.delete("/admin/reservation/:id",ensureAuthenticated, BookingController.delete);






}



