const mongodb = require("mongodb");
const Configs = require("../configs/configs");
const MongoClient = mongodb.MongoClient;

let _database;

/**
 * used to initialize a connection to the database on fly.
 * @param {Function(client)} callback
 */
const mongoConnect = (callback) => {
  MongoClient.connect(Configs.mongoDbConnectionString)
    .then((client) => {
      _database = client.db("shop");
      callback();
    })
    .catch((err) => console.log(err));
};

const getDatabase = () => {
  if (_database) {
    return _database;
  }
  throw "No Database is Found!";
};

module.exports = {
  mongoConnect: mongoConnect,
  getDatabase: getDatabase,
};
