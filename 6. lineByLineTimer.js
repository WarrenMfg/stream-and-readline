const readline = require('readline');
const fs = require('fs');
const { Readable } = require('stream');

const read = fs.createReadStream('./emojiMobyDick.txt', {encoding: 'utf8'});
const regex = /(?:.*\r?\n)/g;



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});




let beginning = true;
read.on('data', (chunk) => {
  if (beginning) {
    console.log('\n>>>>> Line by line timer. <<<<<');
  }
  handleChunk(chunk);
  read.pause();
});




const lineStorage = [];
let lastLineFromLastChunk = '';

function handleChunk(chunk) {
  let temp;

  while ((temp = regex.exec(chunk)) !== null) {
    let line = temp[0].split('\n')[0];
    if (line) {
      if (lastLineFromLastChunk) {
        lineStorage.push(lastLineFromLastChunk + line);
        lastLineFromLastChunk = '';
      } else {
        lineStorage.push(line);
      }
    }
  }

  lastLineFromLastChunk = chunk.split(regex).pop().split('\n')[0];

  if (beginning) {
    beginning = false;
  } else {
    console.log(lineStorage.shift());
  }
}




function nextLine() {
  if (lineStorage.length) {
    console.log(lineStorage.shift());
  } else {
    read.resume();
  }
}



rl.on('line', () => {
  nextLine();
});

setInterval(nextLine, 500);
