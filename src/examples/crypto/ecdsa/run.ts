import { Secp256k1, Ecdsa, keccakAndEcdsa, ecdsa, Bytes32 } from './ecdsa.js';
import assert from 'assert';

// create an example ecdsa signature

let privateKey = Secp256k1.Scalar.random();
let publicKey = Secp256k1.generator.scale(privateKey);

let message = Bytes32.fromString("what's up");

let signature = Ecdsa.sign(message.toBytes(), privateKey.toBigInt());

// investigate the constraint system generated by ECDSA verify

console.time('ecdsa verify only (build constraint system)');
let csEcdsa = await ecdsa.analyzeMethods();
console.timeEnd('ecdsa verify only (build constraint system)');
console.log(csEcdsa.verifySignedHash.summary());

console.time('keccak + ecdsa verify (build constraint system)');
let cs = await keccakAndEcdsa.analyzeMethods();
console.timeEnd('keccak + ecdsa verify (build constraint system)');
console.log(cs.verifyEcdsa.summary());

// compile and prove

console.time('keccak + ecdsa verify (compile)');
await keccakAndEcdsa.compile();
console.timeEnd('keccak + ecdsa verify (compile)');

console.time('keccak + ecdsa verify (prove)');
let { proof } = await keccakAndEcdsa.verifyEcdsa(message, signature, publicKey);
console.timeEnd('keccak + ecdsa verify (prove)');

proof.publicOutput.assertTrue('signature verifies');
assert(await keccakAndEcdsa.verify(proof), 'proof verifies');
