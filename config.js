const { JWT_SECRET = 'some-secret-key' } = process.env;
const { DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
};
