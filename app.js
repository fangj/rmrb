const Sequelize = require('sequelize');
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
  name: Sequelize.STRING,
  author:Sequelize.STRING,
  subject:Sequelize.STRING,
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

async function working(){
  const f=await Forums.findOne({where: {
        type:"forum"
      }});
  console.log(f.toJSON());
}

working();