'use strict';

var _forum = require('../controller/forum');

var Forum = _interopRequireWildcard(_forum);

var _admin = require('../controller/forum/admin');

var Admin = _interopRequireWildcard(_admin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = api => {
    api.get('/latest/:skip', Forum.GetLatest); //Get all latest

    api.get('/categorys', Forum.GetAllCategory); //Get All Categorys and Child in that
    api.get('/category/:link/:skip', Forum.GetCategory); //Get Category by ID

    api.get('/child/:link/:skip', Forum.GetChild); //Get all Topic by Child ID

    api.post('/search', Forum.Search); //Get a Topic by ID

    api.get('/topic/:link', Forum.GetTopic); //Get a Topic by ID
    api.post('/topic/create', Forum.CreateTopic); //Create a Topic
    api.post('/topic/delete', Forum.DeleteTopic); //Delete a Topic
    api.post('/topic/edit', Forum.EditTopic); //Delete a Topic
    api.post('/topic/setting/post', Forum.SettingPostTopic); //Delete a Topic

    api.post('/topic/post/create', Forum.CreatePost); //Add a Post to Topic

    api.post('/admin/category/create', Admin.CreateCategory); //Tạo 1 khu vực lớn
    api.post('/admin/category/delete', Admin.DeleteCategory); //Xóa 1 khu vực lớn
    api.post('/admin/child/create', Admin.CreateChild); //Tạo 1 khu vực con
    api.post('/admin/child/delete', Admin.DeleteChild); //Xóa 1 khu vực con
};
//# sourceMappingURL=forum.js.map