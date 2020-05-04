import colors from 'colors';

export default class Log {
    constructor(){}
    Show(logtext){
        console.log(`${colors.bgGreen.black(' DONE ')} ${logtext.green}`);
    }
    Error(logtext){
        console.log(`${colors.bgRed.black(' ERR  ')} ${logtext.red}`);
    }
    Info(logtext){
        console.log(`${colors.bgBlue.black(' INFO ')} ${logtext.white}`);
    }
    Network(logtext){
        console.log(`${colors.bgCyan.black('  IP  ')} ${logtext.cyan.underline}`);
    }
}
    