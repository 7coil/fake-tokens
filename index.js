const uuidv4 = require('uuid/v4');
const randomNatural = require('random-natural');
const btoa = require('btoa');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bigint = require('bigintjs');
const base64js = require('base64-js');

const tokensDir = 'tokens'

const directories = 5;
const files = 50;
const tokens = 1000;

const id = "152810994933039104";
const b64id = btoa(id);

const discordEpoch = 1420070400; // 2015
const discordConstant = 1293840000; // 2011

const generateRandomTimestampBase64 = () => {
  const timestamp = randomNatural({
    min: discordEpoch,
    max: Math.floor(new Date() / 1000)
  }) - discordConstant;

  return base64js.fromByteArray(bigint(timestamp, 10).toUnsignedBytes()).replace(/\+/g, '_').replace(/\//g, '-').slice(0, -2);
}

for (let i = 0; i < directories; i++) {
  const folderID = uuidv4();

  fs.mkdir(path.join(__dirname, tokensDir, folderID), () => {
    for (let j = 0; j < files; j++) {
      const fileID = uuidv4();
      const tokenList = [];

      for (let k = 0; k < tokens; k++) {
        const secure = btoa(crypto.randomBytes(32)).replace(/\//g, '_').replace(/\=/g, '-').substring(0, 27);
        tokenList.push(`${b64id}.${generateRandomTimestampBase64()}.${secure}`);
      }

      fs.writeFileSync(path.join(__dirname, tokensDir, folderID, `${fileID}.json`), JSON.stringify(tokenList, null, 2) + '\n', (err) => {
        if (err) {
          console.error(`Error writing to ${folderID}.${folderID}: ${err}`);
        } else {
          console.log(`Success writing to ${folderID}.${folderID}`);
        }
      })
    }
  });
}
