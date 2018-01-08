import * as sqlite3 from 'sqlite3';
import * as PouchDB from 'pouchdb';
import * as Sequelize from 'sequelize';

//sqlite3.verbose(); //繁琐模式，该模式下会打印很长的栈信息。

//let db: sqlite3.Database = new sqlite3.Database('cachedb.sqlite3');

const sequelize  = new Sequelize({
    dialect: 'sqlite',
    storage: 'cachedb.sqlite',
    operatorsAliases: false
});

//file model
const FileInfo = sequelize.define('fileInfo', {
    fileURI:        Sequelize.STRING,
    width:          Sequelize.INTEGER,
    heigth:         Sequelize.INTEGER,
    md5:            Sequelize.STRING,
    ext:            Sequelize.STRING,
    lastModifyTime: Sequelize.TIME,
    thumbnail:      Sequelize.STRING
});
const SearchTime = sequelize.define('searchTime', {
    fileURI:        Sequelize.STRING,
    completeSearchTime:  Sequelize.TIME
});




sequelize.sync()
    .then( () => FileInfo.create({
        fileURI: 'c://x.jpg',
        width: 100,
        heigth: 100,
        md5: 'xfe234324234wdfw234',
        ext: 'jpg',
        lastModifyTime: '120.',
        thumbnail: 'xxx.jpg'
    }
));



function isDirectoryNewer(): boolean {

   // let now = Data.now();


    return false;
}


// function createDb() {
//     db = new sqlite3.Database('cachedb.sqlite3'); //打开数据库
//     db.serialize(function() {
//         db.run('CREATE TABLE lorem (info TEXT)');
//
//         let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
//         for (let i = 0; i < 10; i++) {
//             stmt.run('Ipsum ' + i);
//         }
//         stmt.finalize();
//       });
//
//     db.close();
// }
// let pdb = new PouchDB('mylocaldb');
// let doc = {
//     '_id': 'user settings',
//     'name': 'name'
// };
//
// pdb.put(doc);
// pdb.get('user settings').then((doc) => {
//     console.log(doc);
// });