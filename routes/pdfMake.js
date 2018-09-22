const PdfMakeController = require('./../controllers/admin/pdfMakeController');
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');

module.exports = (app) => {

    //888888888888888888888888888
    //88   About Routes    88
    //888888888888888888888888888

    //Print to PDF
    app.get('/admin/pdfmake', PdfMakeController.makepdf);

}