  
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Seatlist=new Schema({
    plane_code: String,
    trip_pattern: String,
    departure_country: String,
    arrival_country: String,
    departure_month:Number,
    departure_day:Number,
    arrival_month:Number,
    arrival_day:Number,
    carry:Number,
    status:{
        type:Number,
        default:0
    },
    createdAt: {type:Date,default:Date.now}
});

var Seat = mongoose.model('Seat', Seatlist);

module.exports = {
    Seat: Seat
};
