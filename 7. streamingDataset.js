// display 25 most frequent URLs from a large CSV, updated in real-time

const fs = require('fs');
const chalk = require('chalk');

const filePath = // your file path here
const read = fs.createReadStream(`${filePath}`, {encoding: 'utf8'});
const regex = /https:\/\/photogalleryservice\.s3\.amazonaws\.com\/(\d*).jpeg/g; // change regex for your needs
const split = /(?:.*\r?\n)/g; // change separator for your needs




let counter = 0;
read.on('data', (chunk) => {
  handleChunk(chunk);
  counter++;
});




let data = [];
let lastLineFromLastChunk = '';

function handleChunk(chunk) {

  let temp = chunk.split('\n').map(row => row.split(','));
  temp.forEach(row => {
    row.forEach(el => data.push(el));
  });

  if (lastLineFromLastChunk) {
    data[0] = lastLineFromLastChunk + data[0];
    lastLineFromLastChunk = '';
  }

  if (data[data.length - 1].includes('https') || // if it contains partial matches
      data[data.length - 1].includes('photo') ||
      data[data.length - 1].includes('gallery') ||
      data[data.length - 1].includes('service') ||
      data[data.length - 1].includes('amazonaws') ||
      data[data.length - 1].includes('jpeg')
      ) {
    if (!regex.test(data[data.length - 1])) { // but not a full match
      lastLineFromLastChunk = data.pop();
    }
  }

  filter();
}




const urlCount = {};
function filter() {
  data.forEach((url, i) => {
    if (regex.test(url)) {
      let jpeg = url.split('.com/')[1];
      urlCount[jpeg] ? urlCount[jpeg]++ : urlCount[jpeg] = 1;
    }
  });
  data = [];

  let urlCountSorted = Object.entries(urlCount).sort((a, b) => b[1] - a[1]).splice(0, 25);

  if (counter % 500 === 0) {
    process.stdout.write('\033c'); // clear terminal
    console.log('\nTOP 25 IMAGES IN DATASET:\n'); // print to terminal
    for (let i = 0; i < 25; i++) {
    console.log(chalk.hsv(90 + (i * 11), 100, 100)('%s'), addHash(urlCountSorted[i][0], urlCountSorted[i][1], i + 1));
    }
  }
}





function addHash(jpeg, num, divisor) {
  const max = 68526;
  let hash = '';

  // add space to left of jpeg if necessary
  while (jpeg.length + hash.length < 8) {
    hash += ' ';
  }

  hash += jpeg + ' ';

  while (hash.length + num.toString().length < 14) {
    hash += ' ';
  }

  hash += num + ' ';

  const numberOfHashes = Math.floor(((num * 176) / max) / divisor); // width of available terminal space 176; divisor is for visual exageration
  for (let i = 0; i < numberOfHashes; i++) {
    hash += '#';
  }

  return hash;
}




read.on('end', () => console.log(chalk.keyword('black').bgHex('#80FF00').bold('%s'), '\n WE HAVE A WINNER! '));
