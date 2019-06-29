const BookingController = require("./../controllers/bookings/bookingController");
const { ensureAuthenticated, ensureGuest } = require("./../helpers/auth");

module.exports = app => {
  //Reservation landing page
  app.get("/", BookingController.eventBooking);

  //Reservation post process
  app.post("/reservation", BookingController.reservation);

  //All Booking Lists
  app.get(
    "/admin/bookings",
    ensureAuthenticated,
    BookingController.bookingLists
  );

  //All Booking Lists pdf template
  app.get(
    "/admin/bookings-pdf-template",
    ensureAuthenticated,
    BookingController.bookingPdfTemplate
  );

  //All Booking Lists pdf template
  app.get(
    "/admin/bookings/pdf",
    ensureAuthenticated,
    BookingController.bookingListsPdfGen
  );

  app.get(
    "/admin/reservation/views/:id",
    ensureAuthenticated,
    BookingController.showDetails
  );

  app.get(
    "/admin/reservation/info/:id",
    ensureAuthenticated,
    BookingController.pdftemplate
  );

  app.get(
    "/admin/reservation/pdf/:id",
    ensureAuthenticated,
    BookingController.pdf
  );

  //Delete reservation
  app.delete(
    "/admin/reservation/:id",
    ensureAuthenticated,
    BookingController.delete
  );
};
