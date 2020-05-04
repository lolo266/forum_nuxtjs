'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = Init;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Init(Server) {
    return new Promise(async (res, rej) => {
        try {
            let Dir = _fs2.default.readdirSync(_path2.default.resolve(__dirname, '../../middleware'));
            if (Dir.length < 1) return res();

            Dir.forEach(file => {
                let JS = /[.js$]+/gm.exec(file);
                if (JS = !'.js') return false;

                Server.Middlewares.push({
                    name: file.split('.js')[0],
                    path: _path2.default.resolve(__dirname, `../../middleware/${file}`)
                });
            });

            res();
        } catch (e) {
            rej(e.toString());
        }
    });
}
//# sourceMappingURL=middleware_init.js.map