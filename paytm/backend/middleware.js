const { JWT_SECRET } = require("./config");

const jwt=require("jsonwebtoken");

const authMiddleware=(req,res,next)=>{
    const authHeaader=req.headers.Authorization;
    if(!token || !authHeaader.startsWith('Bearer ')){
        res.status(403).send("");
    }
    const token=authHeaader.split(' ')[1];
    try{
        jwt.verify(token,JWT_SECRET);
        req.userId=jwt.decode(token).id;
        next();
    }catch(e){
        res.status(403).send("");
    }
}

module.exports={authMiddleware}