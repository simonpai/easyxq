import { useTranslation } from 'react-i18next';
import { useRoom } from '../hook';
import Board from './Board';
import RoomMessages from './RoomMessages.js';
import Result from './Result.js';

export default function Room({
  app,
  autoSave = false,
  settings,
  onQuit,
}) {
  const { t } = useTranslation();
  const [room, actions] = useRoom(settings, { app, autoSave });
  const { state, selected } = room;
  const { players, index, result, events } = state;

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

  const onExit = () => {
    actions.quit();
    onQuit();
  };

  return (
    <div className={classNames.join(' ')}>
      <div className="left-hud">
        <RoomMessages t={t} mirror={mirror} events={events} />
      </div>
      <Board mirror={mirror} state={state} selected={selected} onMove={actions.move} onSelect={actions.select} />
      {
        result && <Result t={t} result={result} onClose={onExit} />
      }
      <div className="upper-right-hud">
      </div>
      <div className="lower-right-hud">
        <Controls
          t={t}
          index={index}
          color={lowerPlayer.color}
          onQuit={onExit}
          onRequestTakeback={actions.requestTakeback}
        />
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="profile">

    </div>
  );
}

function Controls({ t, index, color, onQuit, onRequestTakeback }) {
  return (
    <div className="controls">
      <button type="button" className="btn btn-fiberboard-light" disabled={index < 2} onClick={() => onRequestTakeback(color, index)}>{t('takeback')}</button>
      <button type="button" className="btn btn-fiberboard-light" onClick={onQuit}>{t('quit')}</button>
    </div>
  );
}

function Confirmation({ t, open, message, onConfirm, onCancel }) {
  return (
    <div className="confirmation">
      <div className="confirmation__inner">
        <h2>{message}</h2>
        <div className="confirmation__buttons">
          <button type="button" className="btn btn-fiberboard-light">{t('confirm')}</button>
          <button type="button" className="btn btn-fiberboard-light">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}
