const express = require('express');
const bkfd2Password = require('pbkdf2-password');
const Account = require('../models/Account');
const hasher = bkfd2Password();
const router = express.Router();
var session = require('express-session');
router.get('/', function (req, res) {
    res.render('account/login');
});

router.get('/register', function (req, res) {
    res.render('account/register');
});
router.post('/register', function (req, res) {
    // CHECK USERNAME FORMAT
    // 유저네임으로 사용할 수 있는 문자는 영어와 숫자 뿐
    let idRegex = /^[a-z0-9]+$/;

    if (!idRegex.test(req.body.userid)) {
        return res.status(400).json({ // HTTP 요청에 대한 리스폰스 (json 형식으로)
            error: "BAD ID",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    // 비밀번호 유형 검사 (4보다 작거나, 들어온 비밀번호의 값이 문자열이 아닐 경우)
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    // 기존에 존재하는 username 이 있는지 DB 에서 확인
    Account.findOne({ userid: req.body.userid }, (err, exists) => { //Model.findOne 메소드
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "id EXISTS",
                code: 3
            });
        }

        // CREATE ACCOUNT
        // 위의 코드 1~3 의 결격 사항이 없을 경우 db에 저장
        // hasher 를 이용해 비밀번호 보안
        hasher({ password: req.body.password }, function (err, pass, salt, hash) {
            let account = new Account({
                userid: req.body.userid,
                password: hash,
                salt: salt,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
            });
            account.save(err => {
                if (err) throw err;

                return res.redirect('/');
            });
        });
    });
});

router.post('/login', function (req, res, next) {
    // 비밀번호 데이터 타입 검사 (문자열인지 아닌지)
    if (typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "PASSWORD IS NOT STRING",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    // Model.findOne 메소드로 username 이 같은 DB 검색 (첫번째 인자 : Query)
    Account.findOne({ userid: req.body.userid }, (err, account) => {
        if (err) throw err;

        // CHECK ACCOUNT EXISTANCY
        // 검색 결과가 존재하지 않는 경우
        if (!account) {
            return res.status(401).json({
                error: "THERE IS NO USER",
                code: 2
            });
        }


        // CHECK WHETHER THE PASSWORD IS VALID
        // 유저검색 결과가 있으면 검사 salt값으로 해쉬
        const validate = hasher({ password: req.body.password, salt: account.salt }, function (err, pass, salt, hash) {
            // 입력한 비밀번호를 이용해 만는 해쉬와 DB에 저장된 비밀번호가 같을 경우
            if (hash === account.password) {
                const session = req.session;
                session.point_status=true;
                session.loginInfo = {
                    _id: account._id,
                    userid: account.userid,
                }
                res.redirect('/');

            } else {
                // 다른 경우
                return res.status(401).json({
                    error: "PASSWORD IS NOT CORRECT",
                    code: 3
                });
            }
        });

    });


});

router.get('/logout', (req, res) => {
    //req.session.destroy() -> 세션 파괴
    req.session.destroy(err => {
        if (err) throw err;
    });

    return res.redirect('/');
});

module.exports = router;