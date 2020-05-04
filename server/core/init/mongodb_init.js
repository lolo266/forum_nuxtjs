import _ from 'lodash';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

export function Init(server){
    bluebird.promisifyAll(mongoose);
    return new Promise(async (res, rej) => {
        try {
            await mongoose.connect(server.Config.database, { 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                bufferCommands: false,
                bufferMaxEntries: 0
            });
            server.Log.Show(server.Msg.database.connect.true)
            res(true);
        }
        catch(e){
            server.Log.Error(server.Msg.database.connect.false)
            rej(e.toString());
        }
    });
}

export function BuildModel(List, Server){
    return new Promise((res, rej) => {
        let ModelList = [];

        if(!List || Array.isArray(List) == false) return rej(Server.Msg.build.model.false);
        if(List.length < 1) return res();

        List.forEach(e => {
            if(!e.name || !e.path) return rej(Server.Msg.build.model.false);

            //Check route name
            let nameCheck = _.find(ModelList, (o) => { return o == e.name; });
            if(nameCheck) return rej(`${Server.Msg.build.model.dupe} "${e.name}"`);
            ModelList.push(e.name);

            //Set Model
            mongoose.model(e.name, e.path);

            //Done
            if(ModelList.length == List.length)
                Server.Log.Show(Server.Msg.build.model.true);
                res(mongoose.models);
        });
    });
}