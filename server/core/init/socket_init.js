import _ from 'lodash';
import socketio from 'socket.io';

export function Init(http){
    const io =  socketio(http);
    return io;
}

export function BuildIO(List, Server){
    return new Promise((res, rej) => {
        let SocketList = [];
        if(Array.isArray(List) == false) return rej(Server.Msg.build.socket.false);
        if(List.length < 1) return res();

        List.forEach(e => {
            if(!e.name || !e.path) return rej(Server.Msg.build.socket.false);

            //Check route name
            let nameCheck = _.find(SocketList, (o) => { return o == e.name; });
            if(nameCheck) return rej(`${Server.Msg.build.socket.dupe} "${e.name}"`);
            SocketList.push(e.name);

            //Set Socket
            let io = Server.IO.of(`/${e.name}`)
            //io.on('connect', (socket) => {
            //    e.path(io, socket)
            //});  
            e.path(io) 

            //Done
            if(SocketList.length == List.length){
                Server.Log.Show(Server.Msg.build.socket.true);
                res();
            }
        });
    });
}