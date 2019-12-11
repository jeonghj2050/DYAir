var express = require('express');
var session = require('express-session');
var router = express.Router();
var Question = require("../models/Question");
var moment = require('moment');
require('moment-timezone');
//타임존을 서울 시간과 동일하게 한다.
moment.tz.setDefault("Asia/Seoul");

// /question 라우팅 고객센터 메인 페이지를 보여준다.
router.get('/', function (req, res, next) {
    var session = req.session

    //Question에서 전체 목록 조회(createdAt-등록 날짜 순으로 정렬)
    //result는 find결과값
    Question.find({}).sort('-createdAt').exec(function (err, result) {
        var list1 = [] //전체목록
        var list2 = [] //예매문의 목록
        var list3 = [] //결제문의 목록
        var list4 = [] //취소문의 목록
        var list = [] //모든 리스트 통합
        for (var i = 0; i < result.length; i++) {
            var data2;
            if (result[i].type == "예매문의") { //카테고리 분류별로 list에 담는 값을 정한다.
                data2 = {
                    _id: result[i]._id,
                    type: result[i].type,
                    title: result[i].title,
                    content: result[i].content,
                    writer: result[i].writer,
                    status: result[i].status,
                    secret_status: result[i].secret_status,
                    createdAt: result[i].createdAt
                }
                list2.push(data2)
            } else if (result[i].type == "결제문의") {
                data2 = {
                    _id: result[i]._id,
                    type: result[i].type,
                    title: result[i].title,
                    content: result[i].content,
                    writer: result[i].writer,
                    status: result[i].status,
                    secret_status: result[i].secret_status,
                    createdAt: result[i].createdAt
                }
                list3.push(data2)
            } else if (result[i].type == "취소문의") {
                data2 = {
                    _id: result[i]._id,
                    type: result[i].type,
                    title: result[i].title,
                    content: result[i].content,
                    writer: result[i].writer,
                    status: result[i].status,
                    secret_status: result[i].secret_status,
                    createdAt: result[i].createdAt
                }
                list4.push(data2)
            }
            var data = {
                _id: result[i]._id,
                type: result[i].type,
                title: result[i].title,
                content: result[i].content,
                writer: result[i].writer,
                status: result[i].status,
                secret_status: result[i].secret_status,
                createdAt: result[i].createdAt
            }
            list1.push(data)
        }
        list.push(list1)
        list.push(list2)
        list.push(list3)
        list.push(list4)
        session.questionList = { //questionList에 모든 카테고리별 데이터를 전달
            list: list
        }

        res.render('Qna/qnalist', { session: session, moment: moment });
    });

});

// /question/post get 방식으로 작성페이지 questionpost.ejs를 렌더링한다.
router.get('/post', function (req, res, next) {
    var session = req.session

    if (!session.loginInfo) {
        res.redirect('/account')
    }
    res.render('Qna/questionpost', { session: session });

});

// /question/post post 방식으로 questionpost.ejs에서 작성된 내용을 db에 저장 후 /question으로 라우팅
router.post('/post', function (req, res, next) {
    var c_type = req.body.question_category;
    var type
    var check
    if (c_type == 1) {
        type = "예매문의"
    } else if (c_type == 2) {
        type = "결제문의"
    } else if (c_type == 3) {
        type = "취소문의"
    }
    if (req.body.secretCheck == "1") {
        check = 1
    }
    var question = new Question({
        type: type,
        title: req.body.question_title,
        content: req.body.question_content,
        writer: req.session.loginInfo.userid,
        secret_status: check
    });
    //question을 db에 저장한다.
    question.save(err => {
        if (err) throw err;
        res.redirect('/question');
    });
});

// /question/detail/:objectId DB에서 objectId와 일치하는 문의글 상세 페이지
router.get('/detail/:objectId', function (req, res) {
    let session = req.session;
    if (!session.loginInfo) {
        res.redirect('/account')
    }
    var objectId = req.params.objectId;

    //Question에서 _id가 objectId와 일치하는 결과값을 하나를 find한다.
    Question.findOne({ _id: objectId }, (err, question) => {
        //비밀글이면서 , 로그인 사용자와 글 작성자가 다르고, 로그인 사용자가 관리자가 아닌경우
        if (question.secret_status == 1 && session.loginInfo.userid != question.writer && session.loginInfo.userid != "manager") {
            session.notUser = false;
            return res.render('Qna/qnalist', { session: session, moment: moment })
        }
        //find한 question을 전달
        res.render('Qna/qnadetail', { session, session, question: question })
    })
});
//문의글 수정 페이지로 라우팅
router.get('/update/:objectId', function (req, res) {
    var objectId = req.params.objectId;

    //Question에서 _id가 objectId와 일치하는 결과값을 하나를 find한다.
    Question.findOne({ _id: objectId }, (err, question) => {

        res.render('Qna/questionupdate', { session, session, question: question })
    })
})
//문의글 수정
router.post('/update/:objectId', function (req, res) {
    session = req.session;
    var objectId = req.params.objectId;

    //Question에서 _id가 objectId인 데이터의 content항목을 넘겨받은 데이터로 수정
    Question.updateMany({ _id: objectId }, { content: req.body.update_content }, function (err, result) {
        res.redirect('/question');
    });
})


// /question/detail/:objectId DB에서 objectId와 일치하는 문의글 삭제
router.get('/delete/:objectId', function (req, res) {
    session = req.session;
    var objectId = req.params.objectId;

    //Qusetion에서 _id가 objectId와 일치하는 데이터를 삭제
    Question.deleteOne({ _id: objectId }, function (err) {
        if (err) return res.json(err);
        //res.render("main", { session: session });
        res.redirect('/question');
    });
})

// /question/answer "관리자"만 수행, 문의글에 답변을 달 수 잇는 기능
router.post('/answer', function (req, res) {
    var objectId = req.session.question_detail._id;
    //date형태를 YYYY-MM-DD HH:mm:ss 형식 지정
    let date = moment().format('YYYY-MM-DD HH:mm:ss');

    //Qusetion에서 _id가 objectId와 일치하는 데이터의 여러항목 추가
    Question.updateMany({ _id: objectId }, { comments: req.body.answer_content, status: 1, answerAt: date }, function (err, result) {
        res.redirect('/question');
    });
});

module.exports = router;
