import * as StringLib from '../../plugins/stringcase' ;
import * as Role from './role';

//Latest
export const GetLatest = async (req, res) => {
    try {
        let Topics = await Server.DB.ForumTopics
        .find({})
        .select('category child creator title update link view')
        .populate({path: 'category', select: 'title link'})
        .populate({path: 'child', select: 'title link'})
        .populate({path: 'creator', select: 'profile.name profile.image'})
        .populate({path: 'numPosts'})
        .sort({'update' : -1 })
        .skip((req.params.skip == 0 || !req.params.skip) ? null :Number(req.params.skip))
        .limit(10)
        
        res.json({err: false, topics: Topics});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Category
export const GetAllCategory = async (req, res) => {
    try {
        let Categorys = await Server.DB.ForumCategorys
        .find({})
        .select('title smod link')
        .populate({path: 'smod', select: 'profile.name'})
        .populate({ 
            path: 'childs', select: 'title vip link mod',
            populate: [ 
                { path: 'numTopics' },
                { path: 'numPosts' } ,
                //{ path: 'mod', select: 'profile.name'}
            ],
        })

        res.json({err: false, categorys: Categorys});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const GetAllCategorySearch = async (req, res) => {
    try {
        let Categorys = await Server.DB.ForumCategorys
        .find({})
        .select('title ')
        .populate({ 
            path: 'childs', select: 'title',
        })

        res.json({err: false, categorys: Categorys});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const GetCategory = async (req, res) => {
    try {
        let Category = await Server.DB.ForumCategorys
        .findOne({link: req.params.link})
        .select('title smod')
        .populate({path: 'smod', select: 'profile.name'})
        .populate({path: 'numTopics'});
        
        if(!Category) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let Topics = await Server.DB.ForumTopics
        .find({category: Category._id})
        .select('category child creator title update link view')
        .populate({path: 'category', select: 'title link'})
        .populate({path: 'child', select: 'title link'})
        .populate({path: 'creator', select: 'profile.name profile.image'})
        .populate({path: 'numPosts'})
        .sort({'update' : -1 })
        .skip((req.params.skip == 0 || !req.params.skip) ? null : Number(req.params.skip))
        .limit(10);

        res.json({err: false, topics: Topics, category: Category});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Child
export const GetChild = async (req, res) => {
    try {
        let Child = await Server.DB.ForumChilds
        .findOne({link: req.params.link})
        .select('title vip')
        .populate({path: 'mod', select: 'profile.name profile.image'})
        .populate({path: 'numTopics'});

        if(!Child) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        let Topics = await Server.DB.ForumTopics
        .find({child: Child._id})
        .select('category child creator title update link view')
        .populate({path: 'category', select: 'title link'})
        .populate({path: 'child', select: 'title link'})
        .populate({path: 'creator', select: 'profile.name profile.image'})
        .populate({path: 'numPosts'})
        .sort({'update' : -1 })
        .skip((req.params.skip == 0 || !req.params.skip) ? null :Number(req.params.skip))
        .limit(10);

        res.json({err: false, topics: Topics, child: Child});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Topic
export const GetTopic = async (req, res) => {
    try {
        let Topic = await Server.DB.ForumTopics
        .findOne({ link: req.params.link })
        .populate({path: 'category', select: 'title link smod'})
        .populate({path: 'child', select: 'title link mod'})
        .populate({ path: 'creator', select: 'profile.name' })
        .populate({ 
            path: 'posts', 
            select: 'creator content date',
            populate: [
                { path: 'creator', select: 'profile.name profile.image role' }
            ],
        })
        
        if(!Topic) throw 'Bài viết không tồn tại';

        Topic.view = Topic.view + 1;
        await Topic.save();

        res.json({err: false, topic: Topic});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const CreateTopic = async (req, res) => {
    let {title, content, lockpost, child } = req.body;

    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(title == '' || content == '' || child == '') throw 'Dữ liệu đầu vào không đủ';

        let Child = await Server.DB.ForumChilds
        .findOne({_id: child})
        .select('category vip mod')
        .populate({ path: 'category', select: 'smod' })

        if(!Child) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        if(Child.vip && !Role.CheckCreateVIP(req.auth, Child.category.smod, Child.mod)) throw 'Khu vực vip chỉ dành cho SMod và Mod đăng bài';

        let newTopic = new Server.DB.ForumTopics({
            'category': Child.category._id,
            'child': child,
            'creator': req.auth.id,
            'title': title,
            'content': content,
            'lock.post': typeof lockpost === 'boolean' ? lockpost : false,
        });
        
        await newTopic.save();

        res.json({err: false, link: newTopic.link})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const DeleteTopic = async (req, res) => {
    try {
        let topic = req.body.topic;
        if(!req.auth) throw Server.Msg.user.offline;
        if(topic == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics
        .findOne({_id: topic})
        .select('category creator')
        .populate({ path: 'category', select: 'smod' })
       
        if(!Topic) throw 'Bài viết này không tồn tại hoặc đã bị xóa';
        if(!Role.CheckDelete(req.auth, Topic.category.smod)) throw 'Bạn không đủ quyền xóa bài viết';

        await Topic.remove();

        await Server.DB.ForumPosts.deleteMany({
            topic: Topic._id
        });

        res.json({err: false})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const EditTopic = async (req, res) => {
    try {
        let {topic, content} = req.body;

        if(!req.auth) throw Server.Msg.user.offline;
        if(topic == '' || content == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics
        .findOne({_id: topic})
        .select('content creator')
       
        if(!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';
        if(!Role.CheckEdit(req.auth, Topic.creator)) throw 'Bạn không đủ quyền chỉnh sửa bài viết';

        Topic.content = content;
        await Topic.save();

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const LockPost = async (req, res) => {
    try {
        let topic = req.body.topic;

        if(!req.auth) throw Server.Msg.user.offline;
        if(topic == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics
        .findOne({_id: topic})
        .select('creator lock')
        .populate({path: 'category', select: 'smod'})
        .populate({path: 'child', select: 'mod'})

        if(!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        if(!Role.CheckBLockPost(req.auth, Topic.creator)) throw 'Bạn không đủ quyền dùng chức năng này';

        Topic.lock.post = !Topic.lock.post;
        await Topic.save();

        res.json({err: false})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const LockTopic = async (req, res) => {
    try {
        let { topic, info } = req.body;

        if(!req.auth) throw Server.Msg.user.offline;
        if(topic == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics
        .findOne({_id: topic})
        .select('lock')
        .populate({path: 'category', select: 'smod'})
        .populate({path: 'child', select: 'mod'})

        if(!Topic) throw 'Khu vực này không tồn tại hoặc đã bị xóa';

        if(!Role.CheckLock(req.auth, Topic.category.smod, Topic.child.mod)) throw 'Bạn không đủ quyền dùng chức năng này';

        Topic.lock.all = !Topic.lock.all;
        Topic.lock.info = Topic.lock.all ? info : '';
        await Topic.save();

        res.json({err: false, info: Topic.lock.info})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Post
export const CreatePost = async (req, res) => {
    let {topic, content} = req.body;
    content = StringLib.MutiSpace(content, 'g');

    try {
        if(!req.auth) throw Server.Msg.user.offline;
        if(content == '' || topic == '') throw 'Dữ liệu đầu vào không đủ';

        let Topic = await Server.DB.ForumTopics.findOne({_id: topic})
        .select('category child creator setting update lock')
        .populate({path: 'category', select: 'smod'})
        .populate({path: 'child', select: 'mod'})

        if(!Topic) throw 'Bài viết không tồn tại hoặc đã bị xóa';
        if(!Role.CheckCreatePost(req.auth, Topic.category.smod, Topic.child.mod, Topic.lock)) throw 'Bài viết không thể bình luận';

        let newPosts = new Server.DB.ForumPosts({
            category: Topic.category._id,
            child: Topic.child._id,
            topic: Topic._id,
            creator: req.auth.id,
            content: content
        });
        await newPosts.save();
        
        Topic.update = Date.now();
        await Topic.save();

        res.json({err: false, post: newPosts})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const EditPost = async (req, res) => {
    try {
        let {post, content} = req.body;
        if(!req.auth) throw Server.Msg.user.offline;
        if(post == '' || content == '') throw 'Dữ liệu đầu vào không đủ';

        let Post = await Server.DB.ForumPosts
        .findOne({_id: post})
        .select('content creator')
       
        if(!Post) throw 'Bình luận này không tồn tại';

        if(!Role.CheckEditPost(req.auth, Post.creator)) throw 'Bạn không đủ quyền chỉnh sửa bình luận';

        Post.content = content;
        await Post.save();

        res.json({err: false});
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

export const DeletePost = async (req, res) => {
    try {
        let post = req.body.post;
        if(!req.auth) throw Server.Msg.user.offline;
        if(post == '') throw 'Dữ liệu đầu vào không đủ';

        let Post = await Server.DB.ForumPosts
        .findOne({_id: post})
        .select(' creator')
        .populate({path: 'category', select: 'smod'})
        .populate({path: 'child', select: 'mod'})

        if(!Role.CheckDeletePost(req.auth, Post.category.smod, Post.child.mod, Post.creator)) throw 'Bạn không đủ quyền chỉnh sửa bình luận';

        await Post.remove();

        res.json({err: false})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
};

//Search
export const Search = async (req, res) => {
    let {key, child, category} = req.body;
    key = StringLib.Case(key, '-');

    try {
        if(key == '') throw 'Dữ liệu đầu vào không đủ';

        let Query = {};
        if(child){
            Query['child'] = child;
        }
        if(category){
            Query['category'] = category;
        }
        Query['$text'] = { 
            $search: `\"${key}\"`
        };
        
        let Search = await Server.DB.ForumTopics
        .find(Query)
        .populate({path: 'category', select: 'title'})
        .populate({path: 'child', select: 'title'})
        .populate({path: 'creator', select: 'profile'})
        .populate({path: 'numPosts'})

        res.json({err: false, topics: Search})
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}