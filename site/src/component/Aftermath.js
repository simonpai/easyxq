import { colors } from '@easyxq/sdk';
import { Plate, Chalkboard } from './ui/index.js';

export default function Aftermath({ t, mirror, state, onClose, onQuit }) {
  const { result, players } = state;
  const { type, winner, reason } = result;
  const human = players[mirror ? 1 : 0];
  return (
    <div className="result" data-type={type} data-winner-color={colors.en(winner)}>
      <Chalkboard>
        <div className="result__header">
          <h1 className="result__title">{t(type === 'draw' ? 'draw' : human.color === winner ? 'victory' : 'defeat')}</h1>
          <hr />
        </div>
        {
          reason && <p className="result__subtitle">{t(reason)}</p>
        }
        <div className="result__controls">
          <button type="button" className="btn btn-fiberboard-light" onClick={onQuit}>{t('quit')}</button>
        </div>
      </Chalkboard>
    </div>
  );
}
