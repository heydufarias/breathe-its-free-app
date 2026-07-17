import { useTranslation } from 'react-i18next';
import type { Language } from './lib/types';

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-900">
      <h1 className="text-3xl font-bold text-white font-helvetica">
        {t('home')}
      </h1>

      <div className="flex gap-2">
        <button onClick={() => changeLanguage('pt-BR')}>PT-BR</button>
        <button onClick={() => changeLanguage('en')}>EN</button>
      </div>
    </div>
  );
}

export default App;