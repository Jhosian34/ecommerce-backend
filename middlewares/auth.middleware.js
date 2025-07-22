const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
}

module.exports = auth;