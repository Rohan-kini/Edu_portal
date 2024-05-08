const mongoose=require('mongoose');

const studentschema=new mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true ,
    },
    gender:{
        type:String,
        enum:['M','F','m','f',],
        required:true,
    },
    role:{
        type:String,
        enum:["student","admin"],
        required:true
    }
})

// user:rajrohan
// password:rohitpant
// gender:m

const stud=mongoose.model('stud',studentschema);
module.exports=stud;