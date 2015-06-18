# pkcs1-to-pkcs8-publickey-converter
Converting pkcs1 public key to pkcs8 format.

## Usage
```
const fs = require('fs');
const p1to8pc = require('pkcs1-to-pkcs8-publickey-converter');

const pkcs1 = fs.readFileSync('path/to/id_rsa.pub')
const pkcs8 = p1to8pc(pkcs1, 'rsa'); // or dsa

console.log(pkcs8);
```
