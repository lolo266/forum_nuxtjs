'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Log {
    constructor() {}
    Show(logtext) {
        console.log(`${_colors2.default.bgGreen.black(' DONE ')} ${logtext.green}`);
    }
    Error(logtext) {
        console.log(`${_colors2.default.bgRed.black(' ERR  ')} ${logtext.red}`);
    }
    Info(logtext) {
        console.log(`${_colors2.default.bgBlue.black(' INFO ')} ${logtext.white}`);
    }
    Network(logtext) {
        console.log(`${_colors2.default.bgCyan.black('  IP  ')} ${logtext.cyan.underline}`);
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map