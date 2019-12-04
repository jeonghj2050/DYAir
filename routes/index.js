const express=require('express');
// const account=require('./Account_route');
let session=require('express-session');
const Question=require('./Question_route')


const router=express.Router();

//localhost:3000으로 접속하면 라우팅된다.
router.get('/',function(req,res){
    // session =req.session;
    res.render('index')
    // res.render('index',{session:session});
});

// router.use('/account',account);

router.use('/question',Question);

module.exports=router;