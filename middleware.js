const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456';

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const jwtToken = req.headers.authorization;
    const parts = jwtToken.split(" ");
    const token = parts[1];

    try{
        // const decoded = jwt.verify(token, JWT_SECRET);
        // if(decoded.username){
        //     req.username = decoded.username
        //     next();
        // } else {
        //     res.json({message : "Error in authenticating"})
        // }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expired' });
                }
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } catch(e){
        res.json({message : "Invalid credentials"})
    }
}

module.exports = userMiddleware ;