import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export function Init(Server){
    return new Promise(async (res, rej) => {
        try {
            let Dir = fs.readdirSync(path.resolve(__dirname, '../../middleware'));
            if(Dir.length < 1) return res();

            Dir.forEach(file => {
                let JS = /[.js$]+/gm.exec(file);
                if (JS =! '.js') return false;

                Server.Middlewares.push({
                    name: file.split('.js')[0],
                    path: path.resolve(__dirname, `../../middleware/${file}`)
                });
            });

            res();
        }
        catch(e){
            rej(e.toString());
        }
    });
}