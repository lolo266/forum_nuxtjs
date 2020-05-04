import jwt from 'jsonwebtoken';
import * as StringLib from '../plugins/stringcase' ;

export const Signin = async (req, res) => {
    let { username, password } = req.body;
    username = StringLib.Case(username, '');

    try {
        if(req.auth) throw 'Bạn đã đăng nhập tài khoản';
        if(username == '' || password == '') throw 'Dữ liệu đầu vào không đủ';

        let User = await Server.DB.Users
        .findOne({'auth.username': username})
        .select('auth profile role');
        
        if(!User) throw 'Tài khoản này không tồn tại';
        if(User.auth.password != password) throw 'Mật khẩu không chính xác';

        //Token
        let Token = jwt.sign({
            id: User._id,
            role: User.role
        }, Server.Config.secret, { expiresIn: 30 * 24 * 60 * 60 });

        //End
        res.json({err: false, token: Token, user: User});
    }
    catch(e){
        res.json({err: true, status: e.toString()});
    }
}

export const Signup = async (req, res) => {
    let { username, password, email } = req.body;
    username = StringLib.Case(username, '');

    try {
        if(req.auth) throw 'Bạn đã đăng nhập tài khoản';
        if(username == '' || password == '' || email == '') throw 'Dữ liệu đầu vào không đủ';

        let User = await Server.DB.Users
        .findOne({$or : [ {'auth.username': username}, {'profile.email': email} ]})
        .select('auth');

        if(User) throw 'Tài khoản hoặc email đã tồn tại'

        //New User
        let NewUser = new Server.DB.Users({
            auth: {
                username: username,
                password: password
            },
            profile: {
                name: username,
                email: email,       
            }
        });

        //Save
        await NewUser.save();

        //Token
        let Token = jwt.sign({
            id: NewUser._id,
            role: NewUser.role
        }, Server.Config.secret, { expiresIn: 30 * 24 * 60 * 60 });

        //Send
        res.json({err: false, token: Token, user: NewUser});
    }
    catch(e){
        res.json({err: true, status: e.toString()});
    }
}

export const Get = async (req, res) => {
    try {
        if(!req.auth) throw true;

        let User = await Server.DB.Users
        .findOne({'_id': req.auth.id})
        .select('profile role');

        if(!User) throw true
        
        res.json({user: User});
    }
    catch(e){
        res.status(401).send('Lỗi xác thực tài khoản');
    }
}