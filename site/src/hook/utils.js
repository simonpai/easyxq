import { Room, COLOR, colors, bot } from '@easyxq/sdk';

const { factory } = bot;

export function buildRoom(settings, snapshot) {
  if (snapshot) {
    return buildRoomFromSavedSnapshot(snapshot);
  }
  return buildRoomFromSettings(settings);
}

function buildRoomFromSettings({ mode = '1p', color = 'random', bot = 'random' } = {}) {
  if (mode !== '1p') {
    throw new Error('Only 1p mode is supported for now.');
  }
  color = decodeColor(color);

  const human = {
    type: 'human',
    ui: true,
  };
  const botPlayer = buildBotPlayer(bot);
  const players = color === COLOR.RED ? [human, botPlayer.profile] : [botPlayer.profile, human];

  const room = new Room({ players });

  botPlayer.bot.handle = room.handle(colors.mirror(color));

  return room;
}

function buildRoomFromSavedSnapshot(snapshot) {
  const players = [];
  const bots = []
  for (let player of snapshot.players) {
    let bot;
    if (player.type === 'bot') {
      const p = buildBotPlayer(player);
      player = p.profile;
      bot = p.bot;
    }
    players.push(player);
    bots.push(bot);
  }

  const room = Room.load({ ...snapshot, players });

  if (bots[0]) {
    bots[0].handle = room.handle(COLOR.RED);
  }
  if (bots[1]) {
    bots[1].handle = room.handle(COLOR.BLACK);
  }

  return room;
}

function decodeColor(color) {
  switch (typeof color) {
    case 'number':
      return colors.validate(color);
    case 'string':
      return color === 'random' ? (Math.random() < 0.5 ? COLOR.RED : COLOR.BLACK) : colors.parse(color);
  }
  throw new Error(`Invalid color format: ${color}`);
}

function buildBotPlayer(config) {
  config = factory.normalize(config);
  const profile = buildBotProfile(config);
  const bot = factory.build(config);
  return { profile, bot };
}

function buildBotProfile(config) {
  const { preset } = config;
  return {
    type: 'bot',
    avatar: `/img/avatar/${preset}.png`,
    ...config,
  };
}
