import { colors } from '@easyxq/sdk';
import { useContext } from 'react';
import { TranslationContext } from '../context';

export default function Aftermath({ aftermath, open, setOpen, onExit }) {
  const t = useContext(TranslationContext);
  const { players, result, moves, takebackCounts } = aftermath;
  const { type, winner, reason } = result;
  const human = players[!players[0].ui && players[1].ui ? 1 : 0];
  const title = t(type === 'draw' ? 'draw' : human.color === winner ? 'victory' : 'defeat');
  return (
    <div className={`aftermath ${open ? 'open' : 'closed'}`} data-type={type} data-winner-color={colors.en(winner)}>
      {
        open ?
        <div className="chalkboard wood-framed">
          <div className="aftermath__header">
            <h1 className="aftermath__title">
              {title}
              <button type="button" className="btn aftermath__close-btn" onClick={() => setOpen(false)}></button>
            </h1>
            <hr />
            <div className="aftermath__subtitle">{t('x-in-n-moves', { moves, reason: t(reason) })}</div>
          </div>
          <div className="aftermath__red-stats">
            <h4>{t('red')}</h4>
            <ul>
              <li>{t('takeback')}{t('punctuation.colon')}{takebackCounts[0]}</li>
            </ul>
          </div>
          <div className="aftermath__vertical-bar">
            <hr className="vertical" />
          </div>
          <div className="aftermath__black-stats">
            <h4>{t('black')}</h4>
            <ul>
              <li>{t('takeback')}{t('punctuation.colon')}{takebackCounts[1]}</li>
            </ul>
          </div>
          <div className="aftermath__controls">
            <button type="button" className="btn" onClick={onExit}>{t('exit')}</button>
          </div>
        </div> :
        <div className="chalkboard wood-framed" onClick={() => setOpen(true)}>
          <h1 className="aftermath__title">{title}</h1>
        </div>
      }
    </div>
  );
}
