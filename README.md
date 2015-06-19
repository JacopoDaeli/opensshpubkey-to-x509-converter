# opensshpubkey-to-x509-converter
Convert OpenSSH public key into a x.509 public key.

## Usage
```
const fs = require('fs');
const ospkTo509 = require('opensshpubkey-to-x509-converter');

const openSSHPubKey = fs.readFileSync('path/to/id_rsa.pub')
const x509 = ospkTo509(openSSHPubKey, 'rsa'); // or dsa

console.log(x509);
```
