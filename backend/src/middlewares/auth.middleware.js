import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
import User from '../models/user.model.js'


const verifyJWT = async (req, res, next) => {
    try{
        console.log('request came')
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!accessToken){
            throw new ApiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-refreshToken -password")
        if(!user){
            throw new ApiError(401, "Invalid or expired AccessToken")
        }

        req.user = user
        next()

    } catch(err) {
        console.log(err)
        return res.status(401).json(err?.message)
    }
}


export default verifyJWT