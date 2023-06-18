import { Room, COLOR, colors, bot as _bot } from '@easyxq/sdk';

export function build(settings, snapshot) {
  return snapshot ? buildFromSavedSnapshot(snapshot) : buildFromSettings(settings);
}

function buildFromSettings({ mode = '1p', color = 'random', bot = 'random' } = {}) {
  if (mode !== '1p') {
    throw new Error('Only 1p mode is supported for now.');
  }
  color = decodeColor(color);
  const botColor = colors.mirror(color);

  const human = {
    type: 'human',
    ui: true,
  };
  const botPlayer = buildBotPlayer(bot);
  const players = color === COLOR.RED ? [human, botPlayer.profile] : [botPlayer.profile, human];

  const room = Room.start({ players });

  botPlayer.bot.handle = room.handle(botColor);

  return room;
}

function buildFromSavedSnapshot(snapshot) {
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
  config = _bot.factory.normalize(config);
  const profile = buildBotProfile(config);

  // must be written this way for webpack to work
  const worker = new Worker(new URL('../worker/bot.js', import.meta.url));
  const bot = new _bot.worker.WorkerBot(worker, { config });

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
