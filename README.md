# pkcs1-to-pkcs8-publickey-converter
Converting pkcs1 to pkcs8 public key format.

## Usage
```
const fs = require('fs');
const p1to8pc = require('pkcs1-to-pkcs8-publickey-converter');

const pkcs1 = fs.readFileSync(`${__dirname}/keys/id_rsa.pub`)
const pkcs8 = (pkcs1, 'rsa'); // or dsa

console.log(pkcs8);
```
