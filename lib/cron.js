const cron = require('cron');
const https = require('https');

const job = new cron.CronJob('*/14 * * * *', function () {
  https
    .get(process.env.ASJKTOOKT, (res) => {
      if (res.statusCode === 200) console.log('GET req sent successfully');
      else console.log('Req failed', res.statusCode);
    })
    .on('error', (e) => console.error('Error while sending request', e));
});

module.exports = job;
