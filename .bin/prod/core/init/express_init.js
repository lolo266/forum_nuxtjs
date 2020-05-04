'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = Init;
exports.BuildAPI = BuildAPI;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Init(config) {
    let App = (0, _express2.default)();

    App.use((0, _cors2.default)());
    App.use(_bodyParser2.default.json({ limit: '50mb' }));
    App.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true }));
    App.use((0, _compression2.default)({ level: 9, threshold: 0 }));

    App.use(_helmet2.default.frameguard());
    App.use(_helmet2.default.xssFilter());
    App.use(_helmet2.default.noSniff());
    App.use(_helmet2.default.ieNoOpen());
    App.use(_helmet2.default.hsts({ maxAge: 15778476, includeSubDomains: true, force: true }));
    App.disable('x-powered-by');

    App.use((0, _cookieParser2.default)());
    return App;
}

function BuildAPI(List, Server) {
    return new Promise((res, rej) => {
        let APIList = [];
        if (Array.isArray(List) == false) return rej(Server.Msg.build.api.false);
        if (List.length < 1) return res();

        List.forEach(e => {
            if (!e.name || !e.path) return rej(Server.Msg.build.api.false);

            //Check route name
            let nameCheck = _lodash2.default.find(APIList, o => {
                return o == e.name;
            });
            if (nameCheck) return rej(`${Server.Msg.build.api.dupe} "${e.name}"`);
            APIList.push(e.name);

            //Set Api
            let Api = _express2.default.Router();
            Server.App.use(`/api/${e.name}`, Api);

            //Set Middleware
            if (!e.middleware) return e.path(Api);

            let ListMiddleware = _lodash2.default.words(e.middleware);
            ListMiddleware.forEach(item => {
                let Middleware = Server.Middlewares.find(m => m.name == item);
                if (!Middleware) return false;

                let requireMiddleware = require(Middleware.path);
                Api.use((req, res, next) => {
                    requireMiddleware(req, res, next);
                });
            });
            e.path(Api);
        });

        Server.Log.Show(Server.Msg.build.api.true);
        res();
    });
}
//# sourceMappingURL=express_init.js.map