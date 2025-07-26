import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const protect = expressAsyncHandler((req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: 'Not authorized User, no token' });

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.adminId = decode?.adminId
        next()
    } catch (error) {
        console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized access" });
    }

})