const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var seatSchema=new Schema({
    plane_code:String
});

var Seat = mongoose.model('Seat', seatSchema);

module.exports = {
    Seat: Seat
};