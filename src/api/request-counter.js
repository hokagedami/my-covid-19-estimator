const fs = require('fs');
const path = require('path');
let { requestCount } = require('../../server-data/requestCount');


const requestCounter = (req, res, next) => {
  // eslint-disable-next-line camelcase,no-plusplus
  const json = JSON.stringify({ requestCount: ++requestCount });
  // eslint-disable-next-line consistent-return,no-unused-vars
  fs.writeFile(path.join(__dirname, '../../server-data/requestCount.json'), json, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        error: 'error processing request'
      });
    }
    next();
  });
};

module.exports = requestCounter;
