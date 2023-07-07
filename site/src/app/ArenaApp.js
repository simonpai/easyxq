import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationContext } from '../context';
import { Room } from '../component';
import { useLocalStorage } from '../hook';
import ArenaLobby from './ArenaLobby';

const DEFAULT_STATE = { play: false };
const LOCAL_STORAGE_KEY = 'battle.app';

export default function ArenaApp() {
  const { t } = useTranslation();
  const [savedState = DEFAULT_STATE, saveState] = useLocalStorage(LOCAL_STORAGE_KEY);

  const [state, setState] = useState(savedState);

  const onLobbySubmit = (settings) => setState({ settings, play: true });
  const onRoomQuit = useCallback(() => setState({ play: false }), []);

  const { play, settings } = state;
  saveState(state);

  return (
    <TranslationContext.Provider value={t}>
      {
        play ? <Room app="battle" autoSave={true} settings={settings} onQuit={onRoomQuit} /> : <ArenaLobby onSubmit={onLobbySubmit} />
      }
    </TranslationContext.Provider>
  );
}
