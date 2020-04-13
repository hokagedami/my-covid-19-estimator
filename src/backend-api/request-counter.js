const fs = require('fs');
const path = require('path');


// eslint-disable-next-line consistent-return
const requestCounter = (req, res, next) => {
  try {
    let json = null;
    let requestCount;
    if (fs.existsSync(path.join(__dirname, '../../server-data/requestCount.json'))) {
      // eslint-disable-next-line consistent-return
      fs.readFile(path.join(__dirname, '../../server-data/requestCount.json'), 'utf8', (err, data) => {
        if (err) {
          return res.status(500).json({
            error: 'error processing request'
          });
        }
        const loadedData = JSON.parse(data);
        requestCount = loadedData.requestCount;
        // eslint-disable-next-line camelcase,no-plusplus
        json = JSON.stringify({ requestCount: ++requestCount });
        // eslint-disable-next-line consistent-return,no-unused-vars,no-shadow
        fs.writeFile(path.join(__dirname, '../../server-data/requestCount.json'), json, 'utf8', (err, data) => {
          if (err) {
            return res.status(500).json({
              error: 'error processing request'
            });
          }
          next();
        });
      });
    } else {
      json = JSON.stringify({ requestCount: 1 });
      // eslint-disable-next-line no-unused-vars,consistent-return
      fs.writeFile(path.join(__dirname, '../../server-data/requestCount.json'), json, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).json({
            error: 'error processing request'
          });
        }
        next();
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 'error processing request',
      error: e.message
    });
  }
};

module.exports = requestCounter;
