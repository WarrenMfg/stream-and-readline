const fs = require('fs');
const { Transform } = require('stream');
const split = require('split');
const read = fs.createReadStream('./moby-dick.txt');
const emojiMobyDick = fs.createWriteStream('./emojiMobyDick.txt');

const emojis = {
  a: '🅐',
  his: '👨',
  he: '👨',
  him: '👨',
  man: '👨',
  i: '👁',
  not: '🚫',
  no: '🚫',
  be: '🐝',
  whale: '🐳',
  whales: '🐳',
  or: '🆚',
  now: '⏰',
  which: '👺',
  are: '🆁',
  like: '👍',
  out: '🚪',
  up: '👆',
  more: '⫸',
  old: '👵',
  ship: '⛵️',
  sea: '🌊',
  down: '⬇️',
  who: '🦉',
  time: '⏰',
  her: '👩',
  head: '👩',
  chapter: '📖',
  still: '😶',
  great: '👍',
  said: '🗣',
  captain: '👨‍✈️',
  two: '2️⃣',
  most: '⫸'
};


const replacer = new Transform({

  transform: (buffer, encoding, cb = () => {}) => {

    let string = buffer.toString().toLowerCase();
    for (let word in emojis) {
      const regex = new RegExp('\\b' + word + '\\b', 'g');
      string = string.replace(regex, emojis[word]);
    }

    cb(null, `${string}\n`); // to be called after the chunk has been processed; can pass transformed data instead of chunk
  }
});




read
  .pipe(split())
  .pipe(replacer)
  .pipe(emojiMobyDick);