const allowedOrogins = require("./allowedOrigins");

const corsOPtions={
    origin:(origin,callback)=>{
        // (!origin) for test on postman 
        if(allowedOrogins.indexOf(origin)!==-1 || !origin){
            callback(null,true)
        }else {
            callback(new Error('not allowed by cors'))
        }
    },
    credentials:true,// to send cookies with the request
    optionsSuccessStatus: 200
}

module.exports=corsOPtions;