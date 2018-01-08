import * as process from 'process';
import * as cluster from 'cluster';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import { Stats } from 'fs';
import * as http from 'http';
import { Server } from 'net';

//list all drivers in windows system
function listWin32Drives() {
    let list = child_process.spawn('cmd');
    return new Promise(function (resolve, reject) {
        list.stdout.on('data', function (data) {
            // console.log('stdout: ' + String(data));
            let output = String(data);
            let out = output.split('\r\n').map(function (e) { return e.trim(); }).filter(function (e) { return e != ''; });
            if (out[0] === 'Name') {
                resolve(out.slice(1));
            }
            // console.log("stdoutput:", out)
        });
        list.stderr.on('data', function (data: {}) {
             console.log('stderr: ' + data);
        });
        list.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            if (code !== 0) {
                reject(code);
            }
        });
        list.stdin.write('wmic logicaldisk get name\n');
        list.stdin.end();
    });
}

//
interface SearchCallback {
    (file: string, stats: fs.Stats): void ;
}

function walk(path: string, callback: SearchCallback) {
    //
    let dirList;
    try {
        dirList = fs.readdirSync(path);
    } catch (error) {
        console.log(error);
        return;
    }
    //
    let subDirList: string[] = [];
    let fsStats: fs.Stats;
    //先访问目录下的文件
    dirList.forEach(function (item: string) {
        let strItem: string = path + '/' + item;
        try {
            fsStats = fs.statSync(strItem);
        } catch (e) {
            console.log(e);
            return;
        }
        if (fsStats.isFile()) {
            callback(strItem, fsStats);
        } else if (fsStats.isDirectory()) {
            subDirList.push(strItem);
        }
    });
    //之后访问子目录
    subDirList.forEach(function (item) {
        callback(item, fsStats);
    });
}

/* //use drivelist to get drive info. can only get physical drivers
import * as drivelist from 'drivelist';
interface MountPoint {
    path: string;
}
interface DeviceInfo {
    mountpoints: MountPoint[];
}
function systemWalk(callback: SearchCallback) {
    drivelist.list((error: {}, drives: DeviceInfo[]) => {
        if (error) {
            throw error;
        }
        drives.forEach((device: DeviceInfo) => {
            device.mountpoints.forEach((mp: MountPoint) => {
                walk( mp.path, callback);
            });
        });
    });
}
*/

//访问整个系统
function systemWalk(callback: SearchCallback) {
    //for windows system
    if ( os.platform() == 'win32' ) {
        listWin32Drives().then((data: string[]) => {
             data.forEach((item: string) => {
                 walk(item, callback);
             });
         });
     } else {
         walk(os.homedir(), callback);
    }
}

//search files in the system , make thumbnails
export function indexFiles() {
    //遍历目录 对比记录中修改时间 更新
    systemWalk((fileName: string, stats: fs.Stats) => {
        if (cluster.isWorker && process.send) {
            process.send({'file': fileName, 'stats': stats} );
        } else {
            console.log(fileName);
            console.log(stats.mtime);
        }
    });
    process.on('message', (data: any) => {
        console.log(data);
    });

    //创建一个server等待循环
    let server = http.createServer( (req: http.IncomingMessage, res: http.ServerResponse) => {
            res.writeHead(200, {  'Content-Type' : 'text/plain;charset=utf-8'  }) ;
            res.end('Hello World') ;
        }
    );
    server.listen(1999);
}
//
indexFiles();
