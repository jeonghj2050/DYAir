  
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

//고객센터 기능을 위한 DB Collection Qnalist
const Qnalist=new Schema({
    type: String, //카테고리 분류
    title: String, //글 제목
    content: String, //글 내용
    writer:String, //작정자 아이디
    status:{ //답변 상태 , 답변이 달린 경우 1
        type:Number,
        default:0 
    },
    secret_status:{ //비밀글 여부 , 비밀글인 경우 1
        type:Number,
        default:0
    },
    comments:String, //답변 내용
    createdAt: {type:Date,default:Date.now}, //글 작성 날짜
    answerAt:Date //답변 작성 날짜
});

//모듈로 내보낸다.
module.exports=mongoose.model("Qnalist",Qnalist);