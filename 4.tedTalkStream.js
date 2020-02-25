const fs = require('fs');
const axios = require('axios');
const url = 'https://download.ted.com/talks/MihalyCsikszentmihalyi_2004-480p.mp4?apikey=acme-roadrunner';

axios({
  method: 'GET',
  url: url,
  responseType: 'stream'
})
  .then(res => res.data.pipe(fs.createWriteStream(`./flow.mp4`)))
  .catch(err => console.error(err));