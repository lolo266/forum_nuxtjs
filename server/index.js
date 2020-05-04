import Core from './core';
const Server = new Core();

//Set
Server.Models = [
    { name: 'Users', path: require('./model/user') },
    { name: 'ForumCategorys', path: require('./model/forum/category') },
    { name: 'ForumChilds', path: require('./model/forum/child') },
    { name: 'ForumTopics', path: require('./model/forum/topic') },
    { name: 'ForumPosts', path: require('./model/forum/post') },
];

Server.APIs = [
    //User
    { name: 'auth', path: require('./api/auth'), middleware: 'auth' },
    //Forum
    { name: 'forum', path: require('./api/forum'), middleware: 'auth' },
    //User
    { name: 'user', path: require('./api/user'), middleware: 'auth' },
];

//Run
Server.Run();