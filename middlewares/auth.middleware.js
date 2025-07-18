const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: "Invalid token" });
        }

        req.user = decoded; req
        next(); 
    });
}
module.exports = auth;