import * as StringLib from '../../plugins/stringcase' ;

//Get ALL
export const GetAllCategorys = async (req, res) => {
    try {
        let Categorys = await Server.DB.ForumCategorys
        .find({})
        .select('title smod')
        .populate({ 
            path: 'childs', select: 'title vip link mod',
            populate: {path: 'mod', select: 'profile.name profile.image'},
        })
        .populate({path: 'smod', select: 'profile.name profile.image'})

        res.json({err: false, categorys: Categorys});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Child
export const CreateChild = async (req, res) => {
    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';

        let { category, title, vip } = req.body;
        if(req.body.title == '' || req.body.category == '') throw 'Dữ liệu đầu vào không đủ';

        let newChild = new Server.DB.ForumChilds({
            title: title,
            category: category,
            vip: (vip && typeof vip === 'boolean') ? vip : false,
        });
        await newChild.save();

        res.json({err: false, child: newChild});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const DeleteChild = async (req, res) => {
    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(!req.body.child || !req.body.category) throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumChilds.deleteOne({
            _id: req.body.child,
        });

        await Server.DB.ForumTopics.deleteMany({
            child: req.body.child,
        }); 
        await Server.DB.ForumPosts.deleteMany({
            child: req.body.child,
        });
        
        res.json({err: false})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const EditChild = async (req, res) => {
    try {
        let {title, child} = req.body;
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(title == '' || child == '') throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumChilds.updateOne(
            { _id: child },
            { title: title, link: StringLib.Case(title, '-') }
        );

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const SetMod = async (req, res) => {
    try {
        let {user, child} = req.body;
        user = StringLib.Case(user, '');

        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(user == '' || child == '') throw 'Dữ liệu đầu vào không đủ';

        let Child = await Server.DB.ForumChilds
        .findOne({_id: child})
        .select('mod');

        if(!Child) throw 'Khu vực này không tồn tại';
        if(Child.mod.length == 3) throw 'Khu vực này đã đủ tối đa 3 quản trị viên';

        let User = await Server.DB.Users
        .findOne({'auth.username': user})
        .select('_id profile.name profile.image');

        if(!User) throw 'Tài khoản được ủy quyền không tồn tại';
        if(Child.mod.indexOf(User._id) > -1) throw 'Tài khoản đã có trong danh sách quản trị viên';

        Child.mod.push(User._id);
        await Child.save();

        res.json({err: false, user: User});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const DeleteMod = async (req, res) => {
    try {
        let {user, child} = req.body;
        user = StringLib.Case(user, '');

        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(user == '' || child == '') throw 'Dữ liệu đầu vào không đủ';

        let Child = await Server.DB.ForumChilds
        .findOne({_id: child})
        .select('mod');

        if(!Child) throw 'Khu vực này không tồn tại';
        if(Child.mod.length == 0) throw 'Khu vực này chưa có Mod';

        let User = await Server.DB.Users
        .findOne({'auth.username': user})
        .select('_id');

        if(!User) throw 'Tài khoản được ủy quyền không tồn tại';

        let Index = Child.mod.indexOf(User._id);
        if(Index < 0) throw 'Tài khoản này không có trong danh sách Mod';

        Child.mod.splice(Index, 1);
        await Child.save();

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}


//Category
export const CreateCategory = async (req, res) => {
    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(!req.body.title) throw 'Dữ liệu đầu vào không đủ';

        let newCategory = new Server.DB.ForumCategorys({
            title: req.body.title,
        });

        await newCategory.save();

        res.json({err: false, category: newCategory});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const DeleteCategory = async (req, res) => {
    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(req.body.category == '') throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumCategorys.deleteOne({
            _id: req.body.category,
        });
        await Server.DB.ForumChilds.deleteMany({
            category: req.body.category,
        });

        await Server.DB.ForumTopics.deleteMany({
            category: req.body.category,
        }); 
        await Server.DB.ForumPosts.deleteMany({
            category: req.body.category,
        });

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const EditCategory = async (req, res) => {
    try {
        let {title, category} = req.body;
        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(title == '' || category == '') throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumCategorys.updateOne(
            { _id: category },
            { title: title, link: StringLib.Case(title, '-') }
        );

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const SetSmod = async (req, res) => {
    try {
        let {user, category} = req.body;
        user = StringLib.Case(user, '');

        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(user == '' || category == '') throw 'Dữ liệu đầu vào không đủ';

        let Category = await Server.DB.ForumCategorys
        .findOne({_id: category})
        .select('smod');

        if(!Category) throw 'Khu vực này không tồn tại';
        if(Category.smod) throw 'Khu vực này đã có quản trị viên';

        let User = await Server.DB.Users
        .findOne({'auth.username': user})
        .select('_id profile.name profile.image');

        if(!User) throw 'Tài khoản được ủy quyền không tồn tại'
        if(Category.smod == User._id) throw 'Người này đã là quản trị viên tại khu vực này';

        Category.smod = User._id;
        await Category.save();

        res.json({err: false, user: User});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const DeleteSmod = async (req, res) => {
    try {
        let {user, category} = req.body;
        user = StringLib.Case(user, '');

        if(!req.auth) throw Server.Msg.user.offline;
        if(req.auth.role != 1) throw 'Chức năng chỉ dành cho Quản Trị Viên';
        if(user == '' || category == '') throw 'Dữ liệu đầu vào không đủ';

        let Category = await Server.DB.ForumCategorys
        .findOne({_id: category})
        .select('smod');


        if(!Category) throw 'Khu vực này không tồn tại';
        if(!Category.smod) throw 'Khu vực này chưa có SMod';

        let User = await Server.DB.Users
        .findOne({'auth.username': user})
        .select('_id');

        if(!User) throw 'Tài khoản được ủy quyền không tồn tại';
        if(Category.smod.toString() !== User._id.toString()) throw 'Tài khoản không có trong danh sách quản trị viên tại khu vực này';

        await Server.DB.ForumCategorys.updateOne(
            {_id: category},
            { $unset: { smod: ""} }
        )

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}