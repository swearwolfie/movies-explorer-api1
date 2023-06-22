require('dotenv').config();

const {
  JWT_SECRET = 'JWT_SECRET',
  DB_ADDRESS = 'DB_ADDRESS', // mongodb://127.0.0.1:27017/bitfilmsdb'
  NODE_ENV = 'NODE_ENV',
} = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
  NODE_ENV,
};

/*
const { JWT_SECRET = 'some-secret-key' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
}; */
