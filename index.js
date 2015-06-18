'use strict';

const crypto = require('crypto');
const Ber = require('asn1').Ber;

const RE_KEY_LEN = /(.{64})/g;

let publicKey;
let nStart, nLen, eStart, eLen; // RSA
let pStart, pLen, qStart, qLen, gStart, gLen, yStart, yLen; // DSA

let p = 4 + 7; // 11

let asnWriter = new Ber.Writer();
asnWriter.startSequence();

module.exports = function(publicKey, type, parsed) {
  // Type: rsa, dsa

  if(!parsed) {
    publicKey = require('ssh2-streams').utils.parseKey(publicKey).public;
  }

  if (type === 'rsa') {
    eLen = publicKey.readUInt32BE(p, true);
    p += 4;
    eStart = p;
    p += eLen;

    nLen = publicKey.readUInt32BE(p, true);
    p += 4;
    nStart = p;

    let e = publicKey.slice(eStart, eStart + eLen);
    let n = publicKey.slice(nStart, nStart + nLen);

    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.113549.1.1.1');
    asnWriter.writeNull();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.startSequence();
    asnWriter.writeBuffer(n, Ber.Integer);
    asnWriter.writeBuffer(e, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();

  } else {
    pLen = publicKey.readUInt32BE(p, true);
    p += 4;
    pStart = p;
    p += pLen;

    qLen = publicKey.readUInt32BE(p, true);
    p += 4;
    qStart = p;
    p += qLen;

    gLen = publicKey.readUInt32BE(p, true);
    p += 4;
    gStart = p;
    p += gLen;

    yLen = publicKey.readUInt32BE(p, true);
    p += 4;
    yStart = p;

    p = publicKey.slice(pStart, pStart + pLen);
    let q = publicKey.slice(qStart, qStart + qLen);
    let g = publicKey.slice(gStart, gStart + gLen);
    let y = publicKey.slice(yStart, yStart + yLen);

    asnWriter.startSequence();
    asnWriter.writeOID('1.2.840.10040.4.1');
    asnWriter.startSequence();
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.endSequence();
    asnWriter.endSequence();

    asnWriter.startSequence(Ber.BitString);
    asnWriter.writeByte(0x00);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.endSequence();
  }
  asnWriter.endSequence();

  const b64key = asnWriter.buffer.toString('base64').replace(RE_KEY_LEN, '$1\n');

  let pkcs8 = '-----BEGIN PUBLIC KEY-----\n';
  pkcs8 += b64key;
  pkcs8 += (b64key[b64key.length - 1] === '\n' ? '' : '\n');
  pkcs8 += '-----END PUBLIC KEY-----';

  return pkcs8;
}
