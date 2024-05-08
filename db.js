const mongoose=require('mongoose')

const mongoURL= 'mongodb://localhost:27017/students'

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection;


db.on('connected',()=>{
    console.log("Mongodb connection successfull");
});

db.on('error',(err)=>{
    console.log("Mongodb connection error",err);
});

db.on('disconnected',()=>{
    console.log("Mongodb connection disconnected");
});

module.exports=db;
