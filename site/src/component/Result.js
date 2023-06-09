import { colors } from '@easyxq/sdk';

function zh(reason) {
  // TODO: i18n
  switch (reason) {
    case 'checkmate':
      return '將死';
    case 'stalemate':
      return '困斃';
    default:
      throw new Error(`Unknown reason: ${reason}`);
  }
}

function message(result) {
  const { type, winner, reason } = result;
  switch (type) {
    case 'decisive':
      return `${zh(reason)}\u2003${colors.zh(winner)}勝`;
  }
}

export default function Result({ result, onClose }) {
  const { type, winner } = result;
  return (
    <div className={`result${ onClose ? ' closable' : '' }`} data-type={type} data-winner-color={colors.en(winner)} onClick={onClose}>
      <div className="result__message">{message(result)}</div>
    </div>
  );
}
