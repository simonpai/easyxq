import { useTranslation } from 'react-i18next';
import { ROOM, COLOR } from '@easyxq/sdk';
import { useRoom, useScrollTo } from '../hook';
import Board from './Board';
import Result from './Result.js';

const { EVENT } = ROOM;

export default function Room({
  app,
  autoSave = false,
  settings,
  onQuit,
}) {
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
        <Messages mirror={mirror} events={events} />
      </div>
      <Board mirror={mirror} state={state} selected={selected} onMove={actions.move} onSelect={actions.select} />
      {
        result && <Result result={result} onClose={onExit} />
      }
      <div className="upper-right-hud">
      </div>
      <div className="lower-right-hud">
        <Controls
          index={index}
          color={lowerPlayer.color}
          onQuit={onExit}
          onRequestTakeback={actions.requestTakeback}
        />
      </div>
    </div>
  );
}

function Messages({ mirror, events }) {
  const [ref] = useScrollTo([events.length]);
  return (
    <ul className="messages">
      {
        events.flatMap((event, i) => {
          const { name } = event;
          switch (name) {
            case EVENT.MOVE:
              const messages = [
                <Message key={i} from={(event.color === COLOR.RED) ^ mirror ? 'lower' : 'upper'}>
                  { event.notation }
                </Message>
              ];
              return messages;
          }
          return [];
        })
      }
      <li className="messages__bottom" ref={ref} />
    </ul>
  );
}

function Message({ from, children }) {
  return (
    <li className="message" data-from={from}>
      <div className="message__inner">
        { children }
      </div>
    </li>
  );
}

function Profile() {
  return (
    <div className="profile">

    </div>
  );
}

function Controls({ index, color, onQuit, onRequestTakeback }) {
  const { t } = useTranslation();
  return (
    <div className="controls">
      <button type="button" className="btn btn-fiberboard-light" disabled={index < 2} onClick={() => onRequestTakeback(color, index)}>{t('takeback')}</button>
      <button type="button" className="btn btn-fiberboard-light" onClick={onQuit}>{t('quit')}</button>
    </div>
  );
}

function Confirmation({ open, message, onConfirm, onCancel }) {
  const { t } = useTranslation();
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
