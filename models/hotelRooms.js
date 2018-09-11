const mongosse = require('mongoose');
const Schema = mongosse.Schema;

const hotelRoomSchema = new Schema({

rooms: [{
    roomType: { 
        title: {
            type: String
        },
        desc: {
            type: String
        },
        rackRate: {
            type: String
        },
        saleRate:{
            type: String
        },
        discontRate:{
            type: String
        },
        proRate:{
            type: String
        },
        memberRate:{
            type: String
        },
        status: {
            type: String
        }
    },
}],
});

const HotelRoom = mongoose.model('hotelroom', HotelRoomSchema, 'hotelrooms');
module.exports = HotelRoom;
