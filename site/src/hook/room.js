import { useState, useEffect, useMemo, useCallback } from 'react';
import { pids } from '@easyxq/sdk';
import { useForceUpdate } from './force-update.js';
import { useLocalStorage } from './local-storage.js';
import { buildRoom } from './utils.js';

export default function useRoom(settings = {}, { app, autoSave = false } = {}) {
  const storageKey = autoSave && app ? `${app}.room` : false;
  const [savedRoom, saveRoom, clearRoom] = useLocalStorage(storageKey);

  const [room] = useState(() => buildRoom(settings, savedRoom), [settings]);
  const handle = useMemo(() => room.dualHandle, [room]);
  const [selected, setSelected] = useState(pids.EMPTY);
  const forceUpdate = useForceUpdate();

  /*
  const handleEvent = useCallback(() => {
    console.log('handleEvent');
    forceUpdate();
  });
  */

  useEffect(() => handle.subscribe(forceUpdate), [room]);
  useEffect(() => room.start(), [room]);

  const actions = useMemo(() => ({
    select: pid => setSelected(pid),
    move: (color, index, ply) => {
      setSelected(pids.EMPTY);
      handle.move(color, index, ply);
    },
    requestTakeback: (color, index) => {
      setSelected(pids.EMPTY);
      handle.requestTakeback(color, index);
    },
    quit: clearRoom,
  }), [handle]);

  const { state, snapshot } = room;

  saveRoom(snapshot);

  return [{ state, snapshot, selected }, actions];
}
