const Sequelize = require('sequelize');
const Moment = require('moment');
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
    order: [['postdate'],['tid']]
  });
   const threads=_threads.map(t=>t.toJSON());
  return threads;
}


async function working(){
  const forums=await getAllForums();
  console.log(forums);
  const f0=forums[0];
  const threads=await getThreads(f0.fid);
  console.log(threads);

  //  const t=await Threads.findOne();
  // console.log(t.toJSON());

  //  const m=await TMsgs.findOne();
  // console.log(m.toJSON());
}

working();