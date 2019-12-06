const express=require('express');
const router=express.Router();
let session=require('express-session');
const Question=require('./Question_route')
const Account=require('./Account_route')



//localhost:3000으로 접속하면 라우팅된다.
router.get('/',function(req,res){
    session =req.session;
    res.render('index',{session:session});
});

// router.use('/account',account);

router.use('/question',Question);
router.use('/account',Account);
module.exports=router;