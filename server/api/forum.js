import * as Forum from '../controller/forum';
import * as Admin from '../controller/forum/admin';

module.exports = (api) => {
    //Latest
    api.get('/latest/:skip', Forum.GetLatest); //Get all latest

    //Category
    api.get('/categorys', Forum.GetAllCategory); //Get All Categorys and Child 
    api.get('/categorys/search', Forum.GetAllCategorySearch); //Get All Categorys and Child for Search Page
    api.get('/category/:link/:skip', Forum.GetCategory); //Get Category by ID

    //Child
    api.get('/child/:link/:skip', Forum.GetChild); //Get all Topic by Child ID

    //Search
    api.post('/search', Forum.Search); //Get a Topic by ID
    
    //Topic
    api.get('/topic/:link', Forum.GetTopic); //Get a Topic by ID
    api.post('/topic/create', Forum.CreateTopic); //Create a Topic
    api.post('/topic/delete', Forum.DeleteTopic); //Delete a Topic
    api.post('/topic/edit', Forum.EditTopic); //Delete a Topic
    api.post('/topic/lock/post', Forum.LockPost); //Delete a Topic
    api.post('/topic/lock/all', Forum.LockTopic); //Delete a Topic

    //Post
    api.post('/post/create', Forum.CreatePost); //Tạo 1 bình luận
    api.post('/post/edit', Forum.EditPost); //Sửa nội dung bình luận
    api.post('/post/delete', Forum.DeletePost); //Xóa 1 bình luận
    
    //Admin
    api.get('/admin/categorys', Admin.GetAllCategorys); //Lấy tất cả khu vực

    api.post('/admin/category/create', Admin.CreateCategory); //Tạo 1 khu vực lớn
    api.post('/admin/category/delete', Admin.DeleteCategory); //Xóa 1 khu vực lớn
    api.post('/admin/category/edit', Admin.EditCategory); //Sửa tên 1 khu vực con
    api.post('/admin/category/smod/set', Admin.SetSmod); //Thêm Smod
    api.post('/admin/category/smod/delete', Admin.DeleteSmod); //Xóa Smod

    api.post('/admin/child/create', Admin.CreateChild); //Tạo 1 khu vực con
    api.post('/admin/child/delete', Admin.DeleteChild); //Xóa 1 khu vực con
    api.post('/admin/child/edit', Admin.EditChild); //Sửa tên 1 khu vực con
    api.post('/admin/child/mod/set', Admin.SetMod); //Thêm Mod
    api.post('/admin/child/mod/delete', Admin.DeleteMod); //Xóa Mod
}