'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const CreateChild = exports.CreateChild = async (req, res) => {
    try {
        if (!req.auth) throw Server.Msg.user.offline;
        let { category, title, vip } = req.body;
        if (req.body.title == '' || req.body.category == '') throw 'Dữ liệu đầu vào không đủ';

        let newChild = new Server.DB.ForumChilds({
            title: title,
            category: category,
            vip: vip && typeof vip === 'boolean' ? vip : false
        });
        await newChild.save();

        res.json({ err: false, child: newChild });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const DeleteChild = exports.DeleteChild = async (req, res) => {
    try {
        if (!req.auth) throw Server.Msg.user.offline;
        if (!req.body.child || !req.body.category) throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumChilds.deleteOne({
            _id: req.body.child
        });

        await Server.DB.ForumTopics.deleteMany({
            child: req.body.child
        });
        await Server.DB.ForumPosts.deleteMany({
            child: req.body.child
        });

        res.json({ err: false });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const CreateCategory = exports.CreateCategory = async (req, res) => {
    try {
        if (!req.auth) throw Server.Msg.user.offline;
        if (!req.body.title) throw 'Dữ liệu đầu vào không đủ';

        let newCategory = new Server.DB.ForumCategorys({
            title: req.body.title
        });

        await newCategory.save();

        res.json({ err: false, category: newCategory });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};

const DeleteCategory = exports.DeleteCategory = async (req, res) => {
    try {
        if (!req.auth) throw Server.Msg.user.offline;
        if (req.body.category == '') throw 'Dữ liệu đầu vào không đủ';

        await Server.DB.ForumCategorys.deleteOne({
            _id: req.body.category
        });
        await Server.DB.ForumChilds.deleteMany({
            category: req.body.category
        });

        await Server.DB.ForumTopics.deleteMany({
            category: req.body.category
        });
        await Server.DB.ForumPosts.deleteMany({
            category: req.body.category
        });

        res.json({ err: false });
    } catch (e) {
        res.json({ err: true, status: e.toString() });
    }
};
//# sourceMappingURL=admin.js.map