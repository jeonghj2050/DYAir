const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Account=new Schema({
    userid:String,
    password:String,
    salt: String,
    email:String, 
    phone:String,
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Account",Account);