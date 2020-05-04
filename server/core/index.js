import path from 'path';
import http from 'http';
import localIpV4Address from 'local-ipv4-address';

//Init
import * as Nuxt from './init/nuxt_init';
import * as Express from './init/express_init';
import * as Socket from './init/socket_init';
import * as Mongo from './init/mongodb_init';
import * as Middleware from './init/middleware_init';

//Log
import Log from './lib/log';

export default class Core {
    constructor(){
        this.Config = require(path.resolve('./app.config.js'));
        this.Log = new Log();
        this.Msg = require(path.resolve(`./lang/${this.Config.lang}`));
        this.App = Express.Init(this.Config);
        this.HTTP = http.createServer(this.App);
        this.IO = Socket.Init(this.HTTP);
        this.DB = null;

        //List
        this.APIs = [];
        this.Routes = [];
        this.Sockets = [];
        this.Models = [];
        this.Middlewares = [];
    }
    async Run(){
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
        }
        catch(e){
            this.Log.Error(e.toString());
            this.Log.Info(this.Msg.build.error);
        }
    }
    HTTPStart(){
        this.Log.Info(this.Msg.build.end);
        this.HTTP.listen(process.env.PORT || this.Config.port);

        this.Log.Show(`${this.Msg.server.start}`);
        
        if(!(process.env.NODE_ENV === 'production')){
            if(this.Config.port !== '80') return this.Log.Show(`http://localhost:${this.Config.port}`);
            localIpV4Address().then((ipv4) => {
                this.Log.Network(`http://${ipv4}`);
            });
        }
    }
}