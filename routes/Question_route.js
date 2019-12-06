var express = require('express');
var session = require('express-session');
var router = express.Router();
var Question = require("../models/Question");

// /question 라우팅 고객센터 메인 페이지를 보여준다.
router.get('/', function(req, res, next) {
    var session=req.session
    req.session.notUser = true;
    // let session=req.session;
    Question.find({}).exec( function (err, result) {
        let list=[]

        for(var i=0;i<result.length;i++){
            var no=i+1;
            var data={
                _id:result[i]._id,
                no:no,
                type:result[i].type,
                title:result[i].title,
                content:result[i].content,
                writer:result[i].writer,
                status:result[i].status
            }
            list.push(data)
        }
        session.questionList = {
            qnalist:list
        } 
        res.render('Qna/qnalist',{session:session});
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
router.get('/detail/:objectId', function (req, res) {
    let session = req.session;
    if(!session.loginInfo){
        res.redirect('/account')
    }
    var objectId = req.params.objectId;

    Question.findOne({ _id: objectId }, (err, question) => {
        if(session.loginInfo.userid != question.writer && session.loginInfo.userid != "manager"){
            req.session.notUser = false;
            return res.render('Qna/qnalist', { session: req.session })
        }
        session.question_detail={
            _id:question._id,
            type:question.type,
            title:question.title,
            content:question.content,
            writer:question.writer,
            status:question.status,
            comments:question.comments
        }
        res.render('Qna/qnadetail',{session,session})
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
