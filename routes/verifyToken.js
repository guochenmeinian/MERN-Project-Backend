const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=> {
    const authTokenHeader = req.headers.token;
    // console.log(authTokenHeader); // for testing purpose
    if (authTokenHeader) {
        jwt.verify(authTokenHeader, process.env.JWT_SEC, (err,user)=>{
            if (err) {
                res.status(403).json("Invalid token");
            }
            req.user = user; // this user corresponds to the input authToken after verification process
            next(); // continue to user router
        });
    } else {
        return res.status(401).json("No token provided or not authenticated");
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        // console.log(req.user.id + " " + req.params.id); // for testing purpose
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("No permission to do that");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("No admin permission");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};