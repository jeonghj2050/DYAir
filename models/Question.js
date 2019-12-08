  
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Qnalist=new Schema({
    type: String,
    title: String,
    content: String,
    // writer:mongoose.Schema.Types.ObjectId,
    writer:String,
    status:{
        type:Number,
        default:0
    },
    secret_status:{
        type:Number,
        default:0
    },
    comments:String,
    createdAt: {type:Date,default:Date.now},
    answerAt:Date
});

module.exports=mongoose.model("Qnalist",Qnalist);