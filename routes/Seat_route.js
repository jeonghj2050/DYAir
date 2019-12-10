var express = require('express');
var session = require('express-session');
var router = express.Router();
var Seat = require("../models/Seat");
/*
// /question 라우팅 고객센터 메인 페이지를 보여준다.
router.get('/', function(req, res, next) {
    var session=req.session
    req.session.notUser = true;

    Seat.find({}).exec( function (err, result) {
        let list=[]

        for(var i=0;i<result.length;i++){
            var num=i+1;
            var data={
                _id:result[i]._id,
                num:num,
                trip_pattern:result[i].trip_pattern,
                departure_country:result[i].departure_country,
                arrival_country:result[i].arrival_country,
                departure_month:result[i].departure_month,
                departure_day:result[i].departure_day,
                arrival_month:result[i].arrival_month,
                arrival_day:result[i].arrival_day,
                adult:result[i].adult,
                youth:result[i].youth,
                infant:result[i].infant,
                status:result[i].status
            }
            list.push(data)
        }
        session.seatList = {
            seatList:list
        } 
        res.render('',{session:session});
    });
   
});
*/
/* /question/post get 방식으로 작성페이지 questionpost.ejs를 렌더링한다.
router.get('/post', function(req, res, next) {
    var session=req.session

    if(!session.loginInfo){
        res.redirect('/account')
    }
    res.render('Qna/questionpost',{session:session});
   
});
*/

// /question/post post 방식으로 questionpost.ejs에서 작성된 내용을 db에 저장 후 /question으로 라우팅
router.post('/post', function(req, res, next) {
    var c_type=req.body.question_category;
    var type
    if(c_type==1){
        type="예매문의"
    }else if(c_type==2){
        type="결제문의"
    }else if(c_type==3){
        type="취소문의"
    }
    var question = new Question({
        type:type,
        title:req.body.question_title,
        content:req.body.question_content,
        writer:req.session.loginInfo.userid,
    });

    question.save(err => {
        if (err) throw err;

        res.redirect('/question');
    });  
});

// /question/detail/:objectId DB에서 objectId와 일치하는 문의글 상세 페이지
router.get('/search', function (req, res) {
    let session = req.session;
    if(!session.loginInfo){
        res.redirect('/account')
    }
    //var objectId = req.params.objectId;
    var trp_ptt=req.body.trip_pattern;
    var dpt_country = req.body.departure_country;
    var dpt_month = req.body.dpt_month_opt;
    var dpt_day = req.body.dpt_day_opt;
    var arv_country = req.body.arrival_country;
    var arv_month = req.body.arv_month_opt;
    var arv_day = req.body.arv_day_opt;
    var adult_num = req.body.adult;
    var youth_num = req.body.youth;
    var infant_num = req.body.infant;

    Question.findOne({ 
        trip_pattern: trp_ptt, 
        departure_country: dpt_country, 
        departure_month: dpt_month,
        departure_day: dpt_day,
        arrival_country: arv_country, 
        arrival_month: arv_month,
        arrival_day: arv_day,
        adult: adult_num,
        youth: youth_num,
        infant: infant_num
    }, (err, seat) => {

        session.searched_seat={
            _id:seat._id,
            trip_pattern:seat.trip_pattern,
            departure_country:seat.departure_country,
            arrival_country:seat.arrival_country,
            departure_month:seat.departure_month,
            departure_day:seat.departure_day,
            arrival_month:seat.arrival_month,
            arrival_day:seat.arrival_day,
            adult:seat.adult,
            youth:seat.youth,
            infant:seat.infant,
            status:seat.status,
            comments:seat.comments
        }
        res.render('/main/search',{session,session})
    })
});

// /question/detail/:objectId DB에서 objectId와 일치하는 문의글 삭제
router.get('/delete/:objectId', function (req, res) {
    session = req.session;
    var objectId = req.params.objectId;

    Question.deleteOne({ _id: objectId }, function (err) {
        if (err) return res.json(err);
        //res.render("main", { session: session });
        res.redirect('/question');
    });
})

// /question/answer "관리자"만 수행, 문의글에 답변을 달 수 잇는 기능
router.post('/answer', function (req, res) {
    var objectId = req.session.question_detail._id;

    Question.updateMany({_id: objectId},{comments:req.body.answer_content,status:1}, function (err, result) {
        res.redirect('/question');
    });
});





module.exports = router;
