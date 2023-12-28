const jwt = require("jsonwebtoken");


const auth =(req,res,next)=>{
    try{
        let token =req.headers.authorization;
        if(token){
           token = token.split(" ")[1];
           let user = jwt.verify(token,process.env.SECRET_KEY);
           req.userId=user.id;

        }else{
            return res.status(401).json({mesaage:"Unauthorized User"});
        }
        next();
    }catch(e){
        console.log(e);
        res.status(401).json({mesaage:"Unauthorized User"});
    }
}

module.exports=auth;