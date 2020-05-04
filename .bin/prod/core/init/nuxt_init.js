'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nuxt = require('nuxt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Init = exports.Init = App => {
    const configNuxt = require(_path2.default.resolve('./nuxt.config.js'));
    configNuxt.dev = !(process.env.NODE_ENV === 'production');
    const nuxt = new _nuxt.Nuxt(configNuxt);

    return new Promise(async res => {
        App.use(nuxt.render);

        if (configNuxt.dev) {
            await new _nuxt.Builder(nuxt).build();
            return res();
        }

        res();
    });
};
//import { Nuxt, Builder } from 'nuxt';
//# sourceMappingURL=nuxt_init.js.map