'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (req, res, next) => {
    if (!req.cookies.token) return next();

    _jsonwebtoken2.default.verify(req.cookies.token, Server.Config.secret, (err, decoded) => {
        if (err) return res.status(401).send('Lỗi xác thực tài khoản');

        req.auth = decoded.id;
        next();
    });
};
//# sourceMappingURL=auth.js.map