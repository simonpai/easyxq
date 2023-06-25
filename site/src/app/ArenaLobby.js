import { useState, useMemo } from 'react';
import { ColorOptions, BotOptions } from '../component';
import { useLocalStorage } from '../hook';
import { useTranslation } from 'react-i18next';

const DEFAULT_SETTINGS = {
  color: 'random',
  bot: 'butterfly',
};
const LOCAL_STORAGE_KEY = 'battle.settings';

export default function ArenaLobby({ onSubmit }) {
  const { t } = useTranslation();
  const [savedSettings = DEFAULT_SETTINGS, saveSettings] = useLocalStorage(LOCAL_STORAGE_KEY);

  const [color, setColor] = useState(savedSettings.color);
  const [bot, setBot] = useState(savedSettings.bot);
  const settings = useMemo(() => ({ color, bot }), [color, bot]);
  const onClick = () => onSubmit(settings);

  saveSettings(settings);

  return (
    <div className="lobby">
      <div className="lobby__plate fiberboard">
        <h2>{t('battle-settings')}</h2>
        <hr />
        <ColorOptions selected={color} onSelect={setColor} />
        <hr />
        <BotOptions selected={bot} onSelect={setBot} />
        <hr />
        <button type="button" className="btn btn-fiberboard-light" onClick={onClick}>{t('start')}</button>
      </div>
    </div>
  );
}
