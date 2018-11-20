const crypto = require('crypto').randomBytes(256).toString('hex');
//uri: 'mongodb://localhost:27017/invest'

module.exports = {
  uri: 'mongodb://admin:admin123@ds145355.mlab.com:45355/invest',
  secret: crypto,
  db: 'invest'
}
