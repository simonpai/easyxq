import { useState, useMemo, useContext } from 'react';
import { TranslationContext } from '../context';
import { useLocalStorage } from '../hook';
import { ColorOptions, BotOptions, Polaroid, AvatarImg } from '../component';
import { presets } from '../model';

const DEFAULT_SETTINGS = {
  color: 'random',
  bot: 'butterfly',
};
const LOCAL_STORAGE_KEY = 'battle.settings';

export default function ArenaLobby({ onSubmit }) {
  const t = useContext(TranslationContext);
  const [savedSettings = DEFAULT_SETTINGS, saveSettings] = useLocalStorage(LOCAL_STORAGE_KEY);

  const [color, setColor] = useState(savedSettings.color);
  const [bot, setBot] = useState(savedSettings.bot);
  const settings = useMemo(() => ({ color, bot }), [color, bot]);
  const onClick = () => onSubmit(settings);

  saveSettings(settings);

  return (
    <div className="lobby">
      <div className="lobby__settings cork-board wood-framed">
        <h2>{t('battle-settings')}</h2>
        <hr />
        <ColorOptions selected={color} onSelect={setColor} />
        <hr />
        <BotOptions selected={bot} onSelect={setBot} />
        <hr />
        <button type="button" className="btn btn-fiberboard-light" onClick={onClick}>{t('start')}</button>
      </div>
      <div className="lobby__bot-profile">
        <Profile id={bot} />
      </div>
    </div>
  );
}

function Profile({ id }) {
  const t = useContext(TranslationContext);
  //const profile = presets.get(id);
  return (
    <div className="profile">
      <Polaroid className="avatar" caption={false}>
        <AvatarImg id={id} />
      </Polaroid>
      <div className="profile__info">
        <h3 className="profile__name">
          { t(`char.${id}.name`, { ns: 'bot' }) }
        </h3>
        <hr></hr>
        <p className="profile__description">
          { t(`char.${id}.desc`, { ns: 'bot' }) }
        </p>
      </div>
    </div>
  );
}
