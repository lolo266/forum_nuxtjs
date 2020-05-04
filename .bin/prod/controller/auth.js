'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Get = exports.Signup = exports.Signin = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _stringcase = require('../plugins/stringcase');

var StringLib = _interopRequireWildcard(_stringcase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Signin = exports.Signin = async (req, res) => {
    let { username, password } = req.body;
    username = StringLib.Case(username, '');

    try {
        if (req.auth) throw 'Bạn đã đăng nhập tài khoản';
        if (username == '' || password == '') throw 'Dữ liệu đầu vào không đủ';

        let User = await Server.DB.Users.findOne({ 'auth.username': username }).select('auth profile');

        if (!User) throw 'Tài khoản này không tồn tại';
        if (User.auth.password != password) throw 'Mật khẩu không chính xác';

        //Token
        let Token = _jsonwebtoken2.default.sign({
            id: User._id
        }, Server.Config.secret, { expiresIn: 30 * 24 * 60 * 60 });

        //End
        res.json({ err: false, token: Token, user: User });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const Signup = exports.Signup = async (req, res) => {
    let { username, password, email } = req.body;
    username = StringLib.Case(username, '');

    try {
        if (req.auth) throw 'Bạn đã đăng nhập tài khoản';
        if (username == '' || password == '' || email == '') throw 'Dữ liệu đầu vào không đủ';

        let User = await Server.DB.Users.findOne({ $or: [{ 'auth.username': username }, { 'profile.email': email }] }).select('auth');

        if (User) throw 'Tài khoản hoặc email đã tồn tại';

        //New User
        let NewUser = new Server.DB.Users({
            auth: {
                username: username,
                password: password
            },
            profile: {
                name: username,
                email: email
            }
        });

        //Save
        await NewUser.save();

        //Token
        let Token = _jsonwebtoken2.default.sign({
            id: NewUser._id
        }, Server.Config.secret, { expiresIn: 30 * 24 * 60 * 60 });

        //Send
        res.json({ err: false, token: Token, user: NewUser });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const Get = exports.Get = async (req, res) => {
    try {
        if (!req.auth) throw true;

        let User = await Server.DB.Users.findOne({ '_id': req.auth }).select('profile');

        if (!User) throw true;

        res.json({ user: User });
    } catch (e) {
        res.status(401).send('Lỗi xác thực tài khoản');
    }
};
//# sourceMappingURL=auth.js.map