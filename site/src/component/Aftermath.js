import { colors } from '@easyxq/sdk';
import { Plate } from './ui/index.js';

export default function Aftermath({ t, mirror, state, onClose, onQuit }) {
  const { result, players } = state;
  const { type, winner } = result;
  const human = players[mirror ? 1 : 0];
  return (
    <div className="result" data-type={type} data-winner-color={colors.en(winner)}>
      <Plate onClose={onClose}>
        <h1 className="result__phrase">{t(type === 'draw' ? 'draw' : human.color === winner ? 'victory' : 'defeat')}</h1>
        <div className="hr" />
        <div className="result__btns">
          <button type="button" className="btn btn-fiberboard-light" onClick={onQuit}>{t('quit')}</button>
        </div>
      </Plate>
    </div>
  );
}
