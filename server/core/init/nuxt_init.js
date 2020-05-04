import path from 'path';
//import { Nuxt, Builder } from 'nuxt';
import { Nuxt, Builder } from 'nuxt';

export const Init = (App) => {
    const configNuxt = require(path.resolve('./nuxt.config.js'));
    configNuxt.dev = !(process.env.NODE_ENV === 'production');
    const nuxt = new Nuxt(configNuxt);
    
    return new Promise(async res => {
        App.use(nuxt.render)

        if (configNuxt.dev) {
            await new Builder(nuxt).build();      
            return res();
        } 
        
        res();
    });
}