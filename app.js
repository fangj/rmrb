//数据来源 http://www.mzdbl.cn/rmrb/index.html 虚拟机版
const Sequelize = require('sequelize');
const Moment = require('moment');
const _ =require('lodash');
//test:pwd@192.168.25.128/rmrb
const sequelize = new Sequelize('rmrb', 'test', 'pwd', {
  host: '192.168.25.128',
  dialect: 'mysql',
  define: {
                timestamps: false, // true by default
                
  },
    // pool configuration used to pool database connections
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  dialectOptions:{
      connectTimeout: 60000,//设置MySQL超时时间
    charset:'GBK_CHINESE_CI'
  }  
});

const Forums = sequelize.define('pw_forums', {
  fid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  type: Sequelize.STRING,
  name: Sequelize.STRING,
});

const Threads = sequelize.define('pw_threads', {
  fid:  Sequelize.INTEGER,
  tid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  author:Sequelize.STRING,
  subject:Sequelize.STRING,
  // postdate:Sequelize.INTEGER,
  //https://blog.unlink.link/sql/mysql_before_1970_minus_unixtime.html
  postdate: {
    type: Sequelize.INTEGER,
    get() {
      const pdate = this.getDataValue('postdate');
      return Moment(pdate*1000).format("YYYY-MM-DD");
    },
  },
});

const TMsgs = sequelize.define('pw_tmsgs', {
  tid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
  content:Sequelize.TEXT,
});

Threads.hasOne(TMsgs, { foreignKey: 'tid' })

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
async function getAllForums(){
   const _forums=await Forums.findAll({where: {
        type:"forum"
      },
    });
  const forums=_forums.map(f=>f.toJSON());
  return forums;
}


async function getThreads(fid){
  const _threads=await Threads.findAll({
    where:{
      fid:fid
    },
    include: [ TMsgs ],
    order: [['postdate'],['tid']]
  });
   const threads=_threads.map(t=>t.toJSON());
  return threads;
}

  const fs = require('fs-extra')
const path=require('path');

const fpath=(fname)=>path.join(__dirname,"..","text",fname);

function makeDirs(forums){
  const dirs=forums.map(f=>fpath(f.name));
  console.log(dirs);
  dirs.map(dir=>fs.ensureDirSync(dir));
}

function writeFiles(forumName,threads){
let dirName=fpath(forumName);
for(let i=0;i<threads.length;i++){
  const thread=threads[i];
  const subject=thread.subject;
  const filename=thread.postdate+"_"+_.snakeCase(subject)+".md";
  const tpath=path.join(dirName,filename);
  console.log(tpath);
  const text="### "+thread.subject+"\r\n"+
  thread.author+"\r\n"+
  thread.postdate+"\r\n"+
  thread.pw_tmsg.content+"\r\n";
  // console.log(text);
   fs.writeFileSync(tpath, text);
  }
}

async function working(){
  const forums=await getAllForums();
  makeDirs(forums) //每个月一个目录
  for(let i=0;i<forums.length;i++){//一个月
    const forum=forums[i];
    const threads=await getThreads(forum.fid);
    const groupedThreads=Object.values(_.groupBy(threads,'postdate'));//按天分组
    groupedThreads.forEach(threads=>writeFiles(forum.name,threads));
  }
}

working();