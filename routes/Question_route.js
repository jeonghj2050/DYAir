var express = require('express');
var session = require('express-session');
var router = express.Router();
var Question = require("../models/Question").Question;

/* GET home page. */
router.get('/', function(req, res, next) {
    // let session=req.session;
    res.render('Qna/qnalist');
    // if(!session.loginInfo){
    //     return res.render('login',{session:session});
    // }

    // Question.find({}).populate('writer').exec( function (err, result) {
    //     console.log(result[0]);
    //     res.render('listquestion');
    // });
});

// router.get('/my', function (req, res, next) {
//    let session = req.session;
//     if(!session.loginInfo){
//         return res.render('login',{session:session});
//     }
//     Question.find({writer: session.loginInfo._id}).populate('writer').exec( function (err, result) {
//         console.log(result);
//         res.render('listquestion', { posts: result, session: session, my:true, moment});
//     });

// });

// router.post('/delete', function (req, res, next) {
//     let session=req.session;
//     var questionId = req.body['questionId'];

//     Question.remove({ _id: questionId, writer: session.loginInfo._id }, function(err) {
//         res.redirect('/question/')
//     });
// });

// router.get('/update', function (req, res, next) {
//     let session=req.session;
//     var questionObjId = req.query['questionId'];

//     Question.findOne({_id: questionObjId}, function (err, result) {
//         res.render('addquestion', {session:session, question: result})
//     });
// });

// router.post('/update', function (req, res, next) {
//     var title = req.body['title'];
//     var content = req.body['content'];
//     var type = req.body['type'];
//     var questionId = req.body['questionId'];

//     Question.update({_id: questionId},{content: content, title: title, type: type}, function (err, result) {
//         res.redirect('/question')
//     });
// });

// router.get('/showquestion', function (req, res, next) {
//     let session=req.session;
//     if(!session.loginInfo){
//         return res.render('login',{session:session});
//     }

//     var pId = req.query.pId;

//     console.log(pId);

//     Question.findOne({_id:pId}).populate(['writer', 'comments.writer']).exec(function (err, result) {
//         var content = result.content;
//         content = content.replace(/(?:\r\n|\r|\n)/g, '<br>');
//         result.content = content;
//         console.log(content);
//         res.render('showquestion', {posts: result, session: session, Entities: Entities, moment});
//     });
// });

// router.get('/addquestion', function (req, res, next) {
//     let session=req.session;
//     if(!session.loginInfo){
//         return res.render('login',{session:session});
//     }

//     res.render('addquestion',{session: session, question: null});
// });

// router.post('/addquestion', function (req, res, next) {
//     var accountObjId =req.session.loginInfo._id;
//     var title = req.body['title'];
//     var content = req.body['content'];
//     var type = req.body['type'];
//     Question.create({
//         title: title,
//         content: content,
//         writer: accountObjId,
//         type: type
//     });
//     res.redirect('/question');
// });

// router.post('/addcoment', function (req, res, next) {
//    var content = req.body['content'];
//    var questionObjId = req.body['qId'];
//    var accountObjId =req.session.loginInfo._id;

//    var commentObj = {writer: accountObjId, content: content};

//    Question.update({_id: questionObjId},{$push:{comments:commentObj}}, function (err, result) {
//        res.redirect('/question/showquestion?pId=' + questionObjId);
//    });

//    console.log("");
// });

// router.post('/comment/delete', function (req, res, next) {
//     let session=req.session;
//     var commentId = req.body['commentId'];
//     var questionObjId = req.body['questionId'];

//     Question.update({_id: questionObjId}, {$pull:{comments: {"_id": commentId}}}, function (err, result) {
//         res.redirect('/question/showquestion?pId=' + questionObjId);
//     });
// });

// router.post('/changeComment', function(req, res, next){
//     let session=req.session;
//     var commentId = req.body['commentId']
//     var postId = req.body['postId']
//     var content = req.body['content']

//     Question.update({'_id':postId, 'comments._id': commentId},{'$set':{'comments.$.content': content}},function (err, result) {
//         if(err)
//             console.log('errrrrrrrrrrrrrrrrr : ' + err);
//         else
//             Question.find({_id: postId}).populate('comments.writer').exec(function(err2, result){
//                 if(err2)
//                     console.log('errrrrrrrr2 : ' + err2);
//                 else
//                     res.redirect('/question/showquestion?pId=' + postId)
//             });
//    });
// });

module.exports = router;