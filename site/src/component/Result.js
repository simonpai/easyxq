import { colors } from '@easyxq/sdk';
import { useTranslation } from 'react-i18next';

function message(t, { type, winner, reason }) {
  switch (type) {
    case 'decisive':
      return t('win-phrase', { winner: t(colors.en(winner)), reason: t(reason) });
    case 'draw':
      return t('draw-phrase', { reason: t(reason) });
  }
}

export default function Result({ result, onClose }) {
  const { t } = useTranslation();
  const { type, winner } = result;
  return (
    <div className={`result${ onClose ? ' closable' : '' }`} data-type={type} data-winner-color={colors.en(winner)} onClick={onClose}>
      <div className="result__message">{message(t, result)}</div>
    </div>
  );
}
