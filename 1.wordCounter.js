const fs = require('fs');
const { Transform } = require('stream');
const split = require('split');
const read = fs.createReadStream('./moby-dick.txt');
const flush = fs.createWriteStream('./flush.txt');

const storage = {};
const exclude = {
  ' ': true,
  '': true,
  '\n': true,
  '\r': true,
  '\t': true,
  '.': true,
  '?': true,
  '!': true,
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  ',': true,
  ';': true,
  ':': true,
  '“': true,
  '”': true,
  '_': true,
  '-': true,
  '—': true,
  '/': true,
  '***': true,
  '*': true,
  '#': true,
};




const wordCount = new Transform({
  transform: (buffer, encoding, cb = () => {}) => {

    let words = buffer.toString().toLowerCase().split(' ');

    words = words.map((word) => { // code for side-effects
      let willKeepWord = true;
      for (let key in exclude) {
        if (word === key) {
          willKeepWord = false;
          break;
        }
      }

      if (willKeepWord) {
        word = word.split('').map((char) => {
          let willKeepChar = true;
          for (let key in exclude) {
            if (char === key) {
              willKeepChar = false;
              break;
            }
          }
          if (willKeepChar) {
            return char;
          }
        });

        word = word.join('');
        storage[word] ? storage[word]++ : storage[word] = 1;
        return word;
      }
    });

    cb(null, words.join('')); // to be called after the chunk has been processed; can pass transformed data instead of chunk
  }
});




const findTop100 = () => {
  let result = {};
  let highest = []; // array of objects

  for (let [key, value] of Object.entries(storage)) {
    const tuple = {key, value};
    highest.push(tuple);
  }

  highest.sort((a, b) => b.value - a.value);
  const top100 = highest.splice(0, 100);

  for (let i = 0; i < top100.length; i++) {
    const {key, value} = top100[i];
    result[key] = value;
  }

  fs.writeFile('./top100.json', JSON.stringify(result), () => console.log('top100 written!'));
};




read
  .pipe(split())
  .pipe(wordCount)
  .pipe(flush)
  .on('finish', findTop100);