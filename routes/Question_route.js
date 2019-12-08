var express = require('express');
var session = require('express-session');
var router = express.Router();
var Question = require("../models/Question");
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// /question 라우팅 고객센터 메인 페이지를 보여준다.
router.get('/', function(req, res, next) {
    var session=req.session
    session.notUser=true
    // let session=req.session;
    Question.find({}).sort('-createdAt').exec( function (err, result) {
        var list1=[] 
        var list2=[]
        var list3=[]
        var list4=[]
        var list=[]
        for(var i=0;i<result.length;i++){
            var data2;
            if(result[i].type=="예매문의"){
                data2={
                    _id:result[i]._id,
                    type:result[i].type,
                    title:result[i].title,
                    content:result[i].content,
                    writer:result[i].writer,
                    status:result[i].status,
                    secret_status:result[i].secret_status,
                    createdAt:result[i].createdAt
                }
                list2.push(data2)
            }else if(result[i].type=="결제문의"){
                data2={
                    _id:result[i]._id,
                    type:result[i].type,
                    title:result[i].title,
                    content:result[i].content,
                    writer:result[i].writer,
                    status:result[i].status,
                    secret_status:result[i].secret_status,
                    createdAt:result[i].createdAt
                }
                list3.push(data2)
            }else if(result[i].type=="취소문의"){
                data2={
                    _id:result[i]._id,
                    type:result[i].type,
                    title:result[i].title,
                    content:result[i].content,
                    writer:result[i].writer,
                    status:result[i].status,
                    secret_status:result[i].secret_status,
                    createdAt:result[i].createdAt
                }
                list4.push(data2)
            }
            var data={
                _id:result[i]._id,
                type:result[i].type,
                title:result[i].title,
                content:result[i].content,
                writer:result[i].writer,
                status:result[i].status,
                secret_status:result[i].secret_status,
                createdAt:result[i].createdAt
            }
            list1.push(data)
        }
        list.push(list1)
        list.push(list2)
        list.push(list3)
        list.push(list4)
        session.questionList = {
            list:list
        } 
       
        res.render('Qna/qnalist',{session:session,moment:moment});
    });
   
});

// /question/post get 방식으로 작성페이지 questionpost.ejs를 렌더링한다.
router.get('/post', function(req, res, next) {
    var session=req.session

    if(!session.loginInfo){
        res.redirect('/account')
    }
    res.render('Qna/questionpost');
   
});

// /question/post post 방식으로 questionpost.ejs에서 작성된 내용을 db에 저장 후 /question으로 라우팅
router.post('/post', function(req, res, next) {
    var c_type=req.body.question_category;
    var type
    var check
    if(c_type==1){
        type="예매문의"
    }else if(c_type==2){
        type="결제문의"
    }else if(c_type==3){
        type="취소문의"
    }
    if(req.body.secretCheck=="1"){
        check=1
    }
    var question = new Question({
        type:type,
        title:req.body.question_title,
        content:req.body.question_content,
        writer:req.session.loginInfo.userid,
        secret_status:check
    });

    question.save(err => {
        if (err) throw err;
        res.redirect('/question');
    });  
});

// /question/detail/:objectId DB에서 objectId와 일치하는 문의글 상세 페이지
router.get('/detail/:objectId', function (req, res) {
    let session = req.session;
    if(!session.loginInfo){
        res.redirect('/account')
    }
    var objectId = req.params.objectId;

    Question.findOne({ _id: objectId }, (err, question) => {
        if(question.secret_status==1&&session.loginInfo.userid != question.writer && session.loginInfo.userid != "manager"){
            session.notUser = false;
            return res.render('Qna/qnalist', { session: session, moment:moment })
        }
        session.question_detail={
            _id:question._id,
            type:question.type,
            title:question.title,
            content:question.content,
            writer:question.writer,
            status:question.status,
            createdAt:question.createdAt,
            answerAt:question.answerAt,
            secret_status:question.secret_status,
            comments:question.comments
        }
        res.render('Qna/qnadetail',{session,session})
    })
});
//문의글 수정 페이지로 라우팅
router.get('/update/:objectId', function (req, res) {
    var objectId = req.params.objectId;

    Question.findOne({ _id: objectId }, (err, question) => {
        session.update_detail={
            _id:question._id,
            type:question.type,
            title:question.title,
            content:question.content,
            writer:question.writer,
            status:question.status,
            createdAt:question.createdAt,
            answerAt:question.answerAt,
            comments:question.comments
        }
        res.render('Qna/questionupdate',{session,session})
    })
})
//문의글 수정
router.post('/update', function (req, res) {
    session = req.session;
    var objectId = req.session.question_detail._id;

    Question.updateMany({_id: objectId},{content:req.body.update_content}, function (err, result) {
        res.redirect('/question');
    });
})

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
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    Question.updateMany({_id: objectId},{comments:req.body.answer_content,status:1,answerAt:date}, function (err, result) {
        res.redirect('/question');
    });
});





module.exports = router;
