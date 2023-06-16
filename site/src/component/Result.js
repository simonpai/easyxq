import { colors } from '@easyxq/sdk';
import { useTranslation } from 'react-i18next';
import { resultMessage } from './utils.js';

export default function Result({ result, onClose }) {
  const { t } = useTranslation();
  const { type, winner } = result;
  return (
    <div className={`result${ onClose ? ' closable' : '' }`} data-type={type} data-winner-color={colors.en(winner)} onClick={onClose}>
      <div className="result__message">{resultMessage(t, result)}</div>
    </div>
  );
}
