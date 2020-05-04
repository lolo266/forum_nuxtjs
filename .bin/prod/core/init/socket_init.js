'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = Init;
exports.BuildIO = BuildIO;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Init(http) {
    const io = (0, _socket2.default)(http);
    return io;
}

function BuildIO(List, Server) {
    return new Promise((res, rej) => {
        let SocketList = [];
        if (Array.isArray(List) == false) return rej(Server.Msg.build.socket.false);
        if (List.length < 1) return res();

        List.forEach(e => {
            if (!e.name || !e.path) return rej(Server.Msg.build.socket.false);

            //Check route name
            let nameCheck = _lodash2.default.find(SocketList, o => {
                return o == e.name;
            });
            if (nameCheck) return rej(`${Server.Msg.build.socket.dupe} "${e.name}"`);
            SocketList.push(e.name);

            //Set Socket
            let io = Server.IO.of(`/${e.name}`);
            //io.on('connect', (socket) => {
            //    e.path(io, socket)
            //});  
            e.path(io);

            //Done
            if (SocketList.length == List.length) {
                Server.Log.Show(Server.Msg.build.socket.true);
                res();
            }
        });
    });
}
//# sourceMappingURL=socket_init.js.map