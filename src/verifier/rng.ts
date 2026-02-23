export const mulberry32 = (seed: number): (() => number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const deriveSeed = (rootSeed: number, salt: number): number => {
  const x = (rootSeed ^ (salt * 0x9e3779b9)) >>> 0;
  return x === 0 ? 1 : x;
};
