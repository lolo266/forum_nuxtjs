'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Search = exports.CreatePost = exports.SettingPostTopic = exports.EditTopic = exports.DeleteTopic = exports.CreateTopic = exports.GetTopic = exports.GetChild = exports.GetCategory = exports.GetAllCategory = exports.GetLatest = undefined;

var _stringcase = require('../../plugins/stringcase');

var StringLib = _interopRequireWildcard(_stringcase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//Latest
const GetLatest = exports.GetLatest = async (req, res) => {
    try {
        let Topics = await Server.DB.ForumTopics.find({}).select('category child creator title update link').populate({ path: 'category', select: 'title link' }).populate({ path: 'child', select: 'title link' }).populate({ path: 'creator', select: 'profile' }).populate({ path: 'numPosts' }).sort({ 'update': -1 }).skip(req.params.skip == 0 || !req.params.skip ? null : Number(req.params.skip)).limit(10);

        res.json({ err: false, topics: Topics });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

//Category
const GetAllCategory = exports.GetAllCategory = async (req, res) => {
    try {
        let Categorys = await Server.DB.ForumCategorys.find({}).select('title').populate({
            path: 'childs', select: 'title vip link',
            populate: { path: 'numTopics' }
        });

        res.json({ err: false, categorys: Categorys });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const GetCategory = exports.GetCategory = async (req, res) => {
    try {
        let Category = await Server.DB.ForumCategorys.findOne({ link: req.params.link }).select('title');

        if (!Category) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let Topics = await Server.DB.ForumTopics.find({ category: Category._id }).select('category child creator title update link').populate({ path: 'category', select: 'title link' }).populate({ path: 'child', select: 'title link' }).populate({ path: 'creator', select: 'profile' }).populate({ path: 'numPosts' }).sort({ 'update': -1 }).skip(req.params.skip == 0 || !req.params.skip ? null : Number(req.params.skip)).limit(10);

        res.json({ err: false, topics: Topics, title: Category.title });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

//Child
const GetChild = exports.GetChild = async (req, res) => {
    try {
        let Child = await Server.DB.ForumChilds.findOne({ link: req.params.link }).select('title');

        if (!Child) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let Topics = await Server.DB.ForumTopics.find({ child: Child._id }).select('category child creator title update link').populate({ path: 'category', select: 'title link' }).populate({ path: 'child', select: 'title link' }).populate({ path: 'creator', select: 'profile' }).populate({ path: 'numPosts' }).sort({ 'update': -1 }).skip(req.params.skip == 0 || !req.params.skip ? null : Number(req.params.skip)).limit(10);

        res.json({ err: false, topics: Topics, title: Child.title });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

//Topic
const GetTopic = exports.GetTopic = async (req, res) => {
    try {
        let Topic = await Server.DB.ForumTopics.findOne({ link: req.params.link }).populate({ path: 'category', select: 'title link' }).populate({ path: 'child', select: 'title link' }).populate({ path: 'creator', select: 'profile' }).populate({
            path: 'posts',
            select: 'creator content date',
            populate: [{ path: 'creator', select: 'profile' }]
        });

        if (!Topic) throw 'Bài viết không tồn tại';

        res.json({ err: false, topic: Topic });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const CreateTopic = exports.CreateTopic = async (req, res) => {
    let { title, content, setting, child } = req.body;
    //content = StringLib.MutiSpace(content, 'g');

    try {
        if (!req.auth) throw Server.Msg.user.offline;
        if (title == '' || content == '' || setting == '' || child == '') throw 'Dữ liệu đầu vào không đủ';

        let Child = await Server.DB.ForumChilds.findOne({ _id: child }).select('category vip mod').populate({ path: 'category', select: 'smod' });

        if (!Child) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        if (Child.vip) {
            let isMod = Child.mod.find(item => item == req.auth) ? true : false;
            let isSmod = req.auth == (Child.category.smod ? Child.category.smod : null) ? true : false;

            if (!isSmod && !isMod) throw 'Khu vực vip chỉ dành cho SMod và Mod đăng bài';
        }

        let newTopic = new Server.DB.ForumTopics({
            category: Child.category._id,
            child: child,
            creator: req.auth,
            title: title,
            content: content,
            setting: {
                noftication: typeof setting.noftication === 'boolean' ? setting.noftication : false,
                post: typeof setting.post === 'boolean' ? setting.post : false
            }
        });

        await newTopic.save();

        res.json({ err: false, link: newTopic.link });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const DeleteTopic = exports.DeleteTopic = async (req, res) => {
    try {
        let ID = req.body.topic;
        if (!req.auth) throw Server.Msg.user.offline;
        if (ID == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics.findOne({ _id: ID }).select('category child creator').populate({ path: 'category', select: 'smod' }).populate({ path: 'child', select: 'mod' });

        if (!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let isMod = Topic.child.mod.find(item => item == req.auth) ? true : false;
        let isSmod = req.auth == (Topic.category.smod ? Topic.category.smod : null) ? true : false;
        let isCreator = req.auth == Topic.creator ? true : false;

        if (!isSmod && !isMod && !isCreator) throw 'Bạn không đủ quyền xóa bài viết';

        await Topic.remove();

        res.json({ err: false });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const EditTopic = exports.EditTopic = async (req, res) => {
    try {
        let ID = req.body.topic;
        let Content = req.body.content;

        if (!req.auth) throw Server.Msg.user.offline;
        if (ID == '' || Content == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics.findOne({ _id: ID }).select('content creator');

        if (!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let isCreator = req.auth == Topic.creator ? true : false;

        if (!isCreator) throw 'Bạn không đủ quyền chỉnh sửa bài viết';

        Topic.content = Content;
        await Topic.save();

        res.json({ err: false });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const SettingPostTopic = exports.SettingPostTopic = async (req, res) => {
    try {
        let ID = req.body.topic;

        if (!req.auth) throw Server.Msg.user.offline;
        if (ID == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics.findOne({ _id: ID }).select('category child creator setting').populate({ path: 'category', select: 'smod' }).populate({ path: 'child', select: 'mod' });

        if (!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let isMod = Topic.child.mod.find(item => item == req.auth) ? true : false;
        let isSmod = req.auth == (Topic.category.smod ? Topic.category.smod : null) ? true : false;
        let isCreator = req.auth == Topic.creator ? true : false;

        if (!isSmod && !isMod && !isCreator) throw 'Bạn không đủ quyền dùng chức năng này';

        Topic.setting.post = !Topic.setting.post;
        await Topic.save();

        res.json({ err: false });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

//Post
const CreatePost = exports.CreatePost = async (req, res) => {
    let { topic, content } = req.body;
    content = StringLib.MutiSpace(content, 'g');

    try {
        if (!req.auth) throw Server.Msg.user.offline;
        if (content == '' || topic == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics.findOne({ _id: topic }).select('category child setting update creator');

        if (!Topic) throw 'Bài viết không tồn tại hoặc đã bị xóa';
        if (!Topic.setting.post && Topic.creator != req.auth) throw 'Bài viết đã tắt chức năng bình luận';

        let newPosts = new Server.DB.ForumPosts({
            category: Topic.category,
            child: Topic.child,
            topic: Topic._id,
            creator: req.auth,
            content: content
        });
        await newPosts.save();

        Topic.update = Date.now();
        await Topic.save();

        res.json({ err: false, post: newPosts });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

//Search
const Search = exports.Search = async (req, res) => {
    let { key, child, category } = req.body;
    key = StringLib.Case(key, '-');

    try {
        if (key == '') throw 'Dữ liệu đầu vào không đủ';

        let Query = {};
        if (child) {
            Query['child'] = child;
        }
        if (category) {
            Query['category'] = category;
        }
        Query['$text'] = {
            $search: `\"${key}\"`
        };

        let Search = await Server.DB.ForumTopics.find(Query).populate({ path: 'category', select: 'title' }).populate({ path: 'child', select: 'title' }).populate({ path: 'creator', select: 'profile' }).populate({ path: 'numPosts' });

        res.json({ err: false, topics: Search });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};
//# sourceMappingURL=index.js.map