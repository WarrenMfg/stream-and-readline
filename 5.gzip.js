const fs = require('fs');
const zlib = require('zlib');

const gzip = zlib.createGzip();

let read = fs.createReadStream('./emojiMobyDick.txt');
let write = fs.createWriteStream('./emojiMobyDick.txt.gz');

read
  .pipe(gzip)
  .pipe(write);

write.on('finish', () => {
  console.log('Compression complete!');
});