import { useState, useContext } from 'react';
import { TranslationContext } from '../context';
import { useRoom } from '../hook';
import Board from './Board';
import RoomMessages from './RoomMessages';
import Aftermath from './Aftermath';

export default function Room({
  app,
  autoSave = false,
  settings,
  onQuit: _onQuit,
}) {
  const [room, actions] = useRoom(settings, { app, autoSave });
  const [aftermathOpen, setAftermathOpen] = useState(true);
  const { state, selected } = room;
  const { players, index, events, aftermath } = state;

  // TODO: refactor this
  // render the board in mirror mode only when black uses UI and red doesn't
  const redUi = !!players[0].ui;
  const blackUi = !!players[1].ui;
  const mirror = !redUi && blackUi;

  let [lowerPlayer, upperPlayer] = players;
  if (mirror) {
    [lowerPlayer, upperPlayer] = [upperPlayer, lowerPlayer];
  }

  const classNames = ['room'];
  redUi && classNames.push('red-ui');
  blackUi && classNames.push('black-ui');

  const onQuit = () => {
    actions.quit();
    _onQuit();
  };

  return (
    <div className={classNames.join(' ')}>
      <div className="left-hud">
        <RoomMessages mirror={mirror} events={events} />
      </div>
      <Board mirror={mirror} state={state} selected={selected} onMove={actions.move} onSelect={actions.select} />
      <div className="upper-right-hud">
        <Profile profile={upperPlayer.profile} />
      </div>
      <div className="middle-right-hud">
        {
          aftermath && <Aftermath aftermath={aftermath} open={aftermathOpen} setOpen={setAftermathOpen} onExit={onQuit} />
        }
      </div>
      <div className="lower-right-hud">
        <Controls
          ended={!!aftermath}
          index={index}
          color={lowerPlayer.color}
          onQuit={onQuit}
          onRequestTakeback={actions.requestTakeback}
        />
      </div>
    </div>
  );
}

function Profile({ profile }) {
  const t = useContext(TranslationContext);
  return (
    <div className="profile">
      <div className="profile__avatar ghost-framed">
        <img src={profile.avatar} alt={profile.name} />
      </div>
    </div>
  );
}

function Controls({ ended, index, color, onQuit, onRequestTakeback }) {
  const t = useContext(TranslationContext);
  // TODO: allow takeback on 1p defeat
  return (
    <div className="controls">
      <button type="button" className="btn btn-ghost" disabled={index < 2 || ended} onClick={() => onRequestTakeback(color, index)}>{t('takeback')}</button>
      <button type="button" className="btn btn-ghost" onClick={onQuit}>{t(ended ? 'exit': 'quit')}</button>
    </div>
  );
}

function Confirmation({ open, message, onConfirm, onCancel }) {
  const t = useContext(TranslationContext);
  return (
    <div className="confirmation">
      <div className="confirmation__inner">
        <h2>{message}</h2>
        <div className="confirmation__buttons">
          <button type="button" className="btn btn-ghost">{t('confirm')}</button>
          <button type="button" className="btn btn-ghost">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}
