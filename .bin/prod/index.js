'use strict';

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Server = new _core2.default();

//Set
Server.Models = [{ name: 'Users', path: require('./model/user') }, { name: 'ForumCategorys', path: require('./model/forum/category') }, { name: 'ForumChilds', path: require('./model/forum/child') }, { name: 'ForumTopics', path: require('./model/forum/topic') }, { name: 'ForumPosts', path: require('./model/forum/post') }];

Server.APIs = [
//User
{ name: 'auth', path: require('./api/auth'), middleware: 'auth' },
//Forum
{ name: 'forum', path: require('./api/forum'), middleware: 'auth' }];

//Run
Server.Run();
//# sourceMappingURL=index.js.map