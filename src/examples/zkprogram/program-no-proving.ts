import {
  SelfProof,
  Field,
  ZkProgram,
  verify,
  Proof,
  JsonProof,
  Provable,
  Empty,
  Cache,
} from 'o1js';

let MyProgram = ZkProgram({
  name: 'example-without-proving',
  publicOutput: Field,
  publicInput: Field,
  methods: {
    baseCase: {
      privateInputs: [],
      async method(publicInput: Field) {
        return publicInput.add(4);
      },
    },
  },
});

console.log('program digest', await MyProgram.digest());
let cs = await MyProgram.analyzeMethods();
console.log(cs);
let { verificationKey } = await MyProgram.compile({
  proofsEnabled: false,
});

console.log('proving base case...');
let proof = await MyProgram.baseCase(Field(2));
proof.publicOutput.assertEquals(Field(2).add(4));
