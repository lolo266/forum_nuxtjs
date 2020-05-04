'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _localIpv4Address = require('local-ipv4-address');

var _localIpv4Address2 = _interopRequireDefault(_localIpv4Address);

var _nuxt_init = require('./init/nuxt_init');

var Nuxt = _interopRequireWildcard(_nuxt_init);

var _express_init = require('./init/express_init');

var Express = _interopRequireWildcard(_express_init);

var _socket_init = require('./init/socket_init');

var Socket = _interopRequireWildcard(_socket_init);

var _mongodb_init = require('./init/mongodb_init');

var Mongo = _interopRequireWildcard(_mongodb_init);

var _middleware_init = require('./init/middleware_init');

var Middleware = _interopRequireWildcard(_middleware_init);

var _log = require('./lib/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Init
class Core {
    constructor() {
        this.Config = require(_path2.default.resolve('./app.config.js'));
        this.Log = new _log2.default();
        this.Msg = require(_path2.default.resolve(`./lang/${this.Config.lang}`));
        this.App = Express.Init(this.Config);
        this.HTTP = _http2.default.createServer(this.App);
        this.IO = Socket.Init(this.HTTP);
        this.DB = null;

        //List
        this.APIs = [];
        this.Routes = [];
        this.Sockets = [];
        this.Models = [];
        this.Middlewares = [];
    }
    async Run() {
        this.Log.Info(this.Msg.build.start);
        try {
            await Middleware.Init(this);
            let MongoConect = await Mongo.Init(this);
            let BuildModel = await Mongo.BuildModel(this.Models, this);
            let BuildAPI = await Express.BuildAPI(this.APIs, this);
            let BuildIO = await Socket.BuildIO(this.Sockets, this);
            await Nuxt.Init(this.App);

            this.DB = BuildModel;

            this.HTTPStart();
            global.Server = this;
        } catch (e) {
            this.Log.Error(e.toString());
            this.Log.Info(this.Msg.build.error);
        }
    }
    HTTPStart() {
        this.Log.Info(this.Msg.build.end);
        this.HTTP.listen(process.env.PORT || this.Config.port);

        this.Log.Show(`${this.Msg.server.start}`);

        if (!(process.env.NODE_ENV === 'production')) {
            if (this.Config.port !== '80') return this.Log.Show(`http://localhost:${this.Config.port}`);
            (0, _localIpv4Address2.default)().then(ipv4 => {
                this.Log.Network(`http://${ipv4}`);
            });
        }
    }
}
exports.default = Core;

//Log
//# sourceMappingURL=index.js.map