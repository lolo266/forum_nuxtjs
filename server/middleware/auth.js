import jwt, { decode } from 'jsonwebtoken';

module.exports = (req, res, next) => {
    if(!req.cookies.token) return next();

    jwt.verify(req.cookies.token, Server.Config.secret, (err, decoded) => {
        if(err) return res.status(401).send('Lỗi xác thực tài khoản');

        req.auth = {
            id: decoded.id,
            role: decoded.role
        }
        next();
    });
}