export function knothash(input: string): string {
  const instructions = input
    .split("")
    .map((x) => x.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  let list = new Array(256).fill(0).map((v, i) => i);

  let skipSize = 0;
  let idx = 0;

  for (let r = 0; r < 64; r++) {
    for (let i = 0; i < instructions.length; i++) {
      const length = instructions[i];
      const nu = list.slice(0);
      for (let j = 0; j < length; j++) {
        const jdx = idx + j;
        const rdx = idx + length - 1 - j;
        nu[jdx % list.length] = list[rdx % list.length];
      }
      list = nu;
      idx += length + skipSize;
      skipSize++;
    }
  }

  const sparseHash = list;
  const denseHash = [];
  for (let i = 0; i < 16; i++) {
    const sub = sparseHash.slice(i * 16, (i + 1) * 16);
    const xor = sub.reduce((prev, curr) => prev ^ curr, 0);
    denseHash[i] = xor;
  }

  return denseHash.map((n) => n.toString(16).padStart(2, "0")).join("");
}
