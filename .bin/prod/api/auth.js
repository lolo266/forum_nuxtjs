'use strict';

var _auth = require('../controller/auth');

var AuthController = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = api => {
    api.get('/', AuthController.Get);
    api.post('/signin', AuthController.Signin);
    api.post('/signup', AuthController.Signup);
};
//# sourceMappingURL=auth.js.map