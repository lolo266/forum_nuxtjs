'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = Init;
exports.BuildModel = BuildModel;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Init(server) {
    _bluebird2.default.promisifyAll(_mongoose2.default);
    return new Promise(async (res, rej) => {
        try {
            await _mongoose2.default.connect(server.Config.database, {
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                bufferCommands: false,
                bufferMaxEntries: 0
            });
            server.Log.Show(server.Msg.database.connect.true);
            res(true);
        } catch (e) {
            server.Log.Error(server.Msg.database.connect.false);
            rej(e.toString());
        }
    });
}

function BuildModel(List, Server) {
    return new Promise((res, rej) => {
        let ModelList = [];

        if (!List || Array.isArray(List) == false) return rej(Server.Msg.build.model.false);
        if (List.length < 1) return res();

        List.forEach(e => {
            if (!e.name || !e.path) return rej(Server.Msg.build.model.false);

            //Check route name
            let nameCheck = _lodash2.default.find(ModelList, o => {
                return o == e.name;
            });
            if (nameCheck) return rej(`${Server.Msg.build.model.dupe} "${e.name}"`);
            ModelList.push(e.name);

            //Set Model
            _mongoose2.default.model(e.name, e.path);

            //Done
            if (ModelList.length == List.length) Server.Log.Show(Server.Msg.build.model.true);
            res(_mongoose2.default.models);
        });
    });
}
//# sourceMappingURL=mongodb_init.js.map