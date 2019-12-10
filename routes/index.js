const express=require('express');
const router=express.Router();
let session=require('express-session');
const Question=require('./Question_route')
const Account=require('./Account_route')
const Seat = require("../models/Seat").Seat

//localhost:3000으로 접속하면 라우팅된다.
router.get('/',function(req,res){
    session =req.session;
    Seat.find({},function(req,seat){
        //console.log(seat);
        res.render('index',{session:session,seat:seat})
    })
});

// 좌석 예매
router.get('/reserve/:listId', function (req, res, next) {
    session = req.session;
    var seatId = req.params.listId;
    console.log(seatId);
    Seat.updateMany({_id: seatId},{status:2}, function (err, result) {
        res.redirect('/');
    });
})

// 좌석 예매 취소
router.get('/cancel/:listId', function (req, res, next) {
    session = req.session;
    var seatId = req.params.listId;
    //console.log(seatId);
    Seat.updateMany({_id: seatId},{status:0}, function (err, result) {
        res.redirect('/');
    });
})

// 좌석 조회
router.post('/searchSeat', function (req, res, next) {
    let session = req.session;

console.log(req.body.departure_country);
console.log(req.body.arrival_country);
    Seat.find({ 
        departure_country: req.body.departure_country,
        arrival_Country: req.body.arrival_country
     }, (err, seat) => {
         console.log(seat);
        res.render('index',{session:session, seat:seat})
    })
});

router.use('/question',Question);
router.use('/account',Account);
module.exports=router;