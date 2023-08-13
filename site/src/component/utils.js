export function getSidCssProperties(sid) {
  const rank = sid >> 4;
  const file = sid & 0x0F;
  const x = 50 + file * 100;
  const y = (9 - rank) * 100;
  const transform = `translate3d(${x}%, ${y}%, 0)`;
  return { transform };
}

export function url(path) {
  return `${PATH_PREFIX}${path}`;
}
