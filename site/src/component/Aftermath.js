import { colors } from '@easyxq/sdk';
import { Chalkboard } from './ui/index.js';

export default function Aftermath({ t, aftermath, open, onOpen, onClose, onQuit }) {
  const { players, result, moves } = aftermath;
  const { type, winner, reason } = result;
  const human = players[!players[0].ui && players[1].ui ? 1 : 0];
  return (
    <div className={`aftermath ${open ? 'open' : 'closed'}`} data-type={type} data-winner-color={colors.en(winner)}>
      <Chalkboard>
        <div className="aftermath__header">
          <h1 className="aftermath__title">{t(type === 'draw' ? 'draw' : human.color === winner ? 'victory' : 'defeat')}</h1>
          <hr />
          <div className="aftermath__subtitle">{t('x-in-n-moves', { moves, reason: t(reason) })}</div>
        </div>
        <div className="aftermath__red-stats">
          <h4>{t('red')}</h4>
          <ul>
            <li>{t('takeback')}{t('colon')}{aftermath.takebackCounts[0]}</li>
          </ul>
        </div>
        <div className="aftermath__vertical-bar">
          <hr className="vertical" />
        </div>
        <div className="aftermath__black-stats">
          <h4>{t('black')}</h4>
          <ul>
            <li>{t('takeback')}{t('colon')}{aftermath.takebackCounts[1]}</li>
          </ul>
        </div>
        <div className="aftermath__controls">
          <button type="button" className="btn btn-fiberboard-light" onClick={onQuit}>{t('quit')}</button>
        </div>
      </Chalkboard>
    </div>
  );
}
