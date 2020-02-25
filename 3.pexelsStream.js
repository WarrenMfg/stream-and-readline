const fs = require('fs');
const axios = require('axios');
const url = 'https://player.vimeo.com/external/329728953.hd.mp4?s=c8849e9c40586bb228fe7069b389f954b2cfcde0&profile_id=175&oauth2_token_id=57447761';

axios({
  method: 'GET',
  url: url,
  responseType: 'stream'
})
  .then(res => res.data.pipe(fs.createWriteStream(`./stream.mp4`)) )
  .catch(err => console.error(err));