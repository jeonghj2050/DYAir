  
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Qnalist=new Schema({
    type: Number,
    title: String,
    content: String,
    writer:mongoose.Schema.Types.ObjectId,
    status:{
        type:Number,
        default:0
    },
    createdAt: {type:Date,default:Date.now}
});

module.exports=mongoose.model("Qnalist",Qnalist);