import { useTranslation } from 'react-i18next';
import type { Language } from './lib/types';

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white text-gray-400 font-helvetica">
      <h1 className="text-3xl font-bold ">
        {t('home')}
      </h1>

      <div className="flex gap-2">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('pt-BR')}>PT-BR</button>
      </div>
    </div>
  );
}

export default App;