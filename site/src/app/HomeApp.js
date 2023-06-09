import { useTranslation } from 'react-i18next';
import { url } from '../component/utils.js';

export default function HomeApp() {
  const { t } = useTranslation();
  return (
    <div className="lobby">
      <div className="menu">
        <a type="button" className="btn btn-fiberboard-light" href={url('battle/')}>{t('battle')}</a>
      </div>
    </div>
  );
}
