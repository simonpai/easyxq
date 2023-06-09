import { useState, useCallback } from 'react';
import { Room } from '../component';
import { useLocalStorage } from '../hook';
import BattleLobby from './BattleLobby';

const DEFAULT_STATE = { play: false };
const LOCAL_STORAGE_KEY = 'battle.app';

export default function BattleApp() {
  const [savedState = DEFAULT_STATE, saveState] = useLocalStorage(LOCAL_STORAGE_KEY);

  const [state, setState] = useState(savedState);

  const onLobbySubmit = (settings) => setState({ settings, play: true });
  const onRoomQuit = useCallback(() => setState({ play: false }), []);

  const { play, settings } = state;
  saveState(state);

  return (
    play ? <Room app="battle" autoSave={true} settings={settings} onQuit={onRoomQuit} /> : <BattleLobby onSubmit={onLobbySubmit} />
  );
}
