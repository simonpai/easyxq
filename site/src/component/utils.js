import { colors } from '@easyxq/sdk';

export function getSidCssProperties(sid) {
  const rank = sid >> 4;
  const file = sid & 0x0F;
  const x = 50 + file * 100;
  const y = (9 - rank) * 100;
  const transform = `translate(${x}%, ${y}%)`;
  return { transform };
}

export function url(path) {
  return `${PATH_PREFIX}${path}`;
}

export function resultMessage(t, { type, winner, reason }) {
  switch (type) {
    case 'decisive':
      return t('win-phrase', { winner: t(colors.en(winner)), reason: t(reason) });
    case 'draw':
      return t('draw-phrase', { reason: t(reason) });
  }
}
