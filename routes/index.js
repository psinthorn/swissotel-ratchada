const IndexController = require('./../controllers/IndexController');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');


module.exports = (app) => {


  //Thank You
  app.get('/thank-you', IndexController.thankYou);

  //about page
  app.get('/about', IndexController.about);  

  //transfers booking form
  app.get('/terms-conditions', IndexController.termPolicy );


  //Contact page
  app.get('/contact-us', IndexController.contact);

  //Maps
  app.get('/maps', IndexController.maps);
  app.get('/geocode/:id', IndexController.geocode);
  app.get('/geocode', IndexController.geocode);

}