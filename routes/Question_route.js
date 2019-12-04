var express = require('express');
var session = require('express-session');
var router = express.Router();
var Question = require("../models/Question").Question;


router.get('/', function(req, res, next) {
    // let session=req.session;
    res.render('Qna/qnalist');
   
});

module.exports = router;
