import jwt from 'jsonwebtoken'

const isAuthenticated= async(req,res,next)=>{
    try {
        const token=await req.cookies.token;
        // console.log("nnnnnnnnnnnnnn",req.cookies); // Log cookies to see if the token is being sent
        // console.log("Request Headers:", req.headers);
        // console.log("Cookies in Request:", req.cookies);
        
        if(!token) {
            console.log("token do not exits")
            return res.status(401).json({
                message:"User not authenticated",
                success:false,
            });
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode) {
            console.log("invalid token")
            return res.status(401).json({
                message:"Invalid token",
                success:false,
            });
        }

        req.id=decode.userId;
        next();

    }
    catch(error) {
        console.log(error);
        console.log(error);
    }
}

export default isAuthenticated;
