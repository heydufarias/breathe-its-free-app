import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { cn } from './lib/utils';
import type { BreathMode } from './lib/types';

const layoutVariants = cva(
  'transition-colors duration-500',
  {
    variants: {
      mode: {
        relax: 'bg-emerald-50 text-relax',
        focus: 'bg-orange-50 text-focus',
        sleep: 'bg-violet-50 text-sleep',
      },
    },
  }
);

const solidBgVariants = cva(
  'transition-colors duration-500',
  {
    variants: {
      mode: {
        relax: 'bg-relax',
        focus: 'bg-focus',
        sleep: 'bg-sleep',
      },
    },
  }
);

const indicatorVariants = cva(
  'transition-all duration-500 ease-in-out',
  {
    variants: {
      mode: {
        relax: 'translate-x-0',
        focus: 'translate-x-full',
        sleep: 'translate-x-[200%]',
      },
    },
  }
);

const MODES: BreathMode[] = ['relax', 'focus', 'sleep'];

function App() {
  const { t, i18n } = useTranslation();

  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    const savedMode = localStorage.getItem('breathMode');
    return (savedMode as BreathMode) || 'relax';
  });

  const [cycles, setCycles] = useState(7);

  useEffect(() => {
    localStorage.setItem('breathMode', currentMode);
  }, [currentMode]);

  return (
    <div className={cn('relative flex h-dvh w-screen flex-col overflow-hidden font-helvetica', layoutVariants({ mode: currentMode }))}>
      <Header />

      <main className="relative flex flex-1 flex-col items-center justify-center font-semibold tracking-tight">
        <div className="flex pb-1 text-3xl">
          {t('Select mode')}
        </div>

        <div
          className={cn(
            'relative flex rounded-full p-1 backdrop-blur-2xl backdrop-saturate-150',
            solidBgVariants({ mode: currentMode })
          )}
        >
          <div className={cn('absolute bottom-1 left-1 top-1 w-40 rounded-full bg-white backdrop-blur-md ', indicatorVariants({ mode: currentMode }))} />

          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={cn(
                'relative z-10 flex h-16 w-40 cursor-pointer items-center justify-center border-none bg-transparent text-center text-2xl transition-colors duration-300',
                currentMode === mode ? '' : 'text-white/60'
              )}
            >
              <span className="relative inline-block overflow-hidden leading-none">
                <motion.span
                  key={`${mode}-${i18n.language}`}
                  initial={{ opacity: 1, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="inline-block"
                >
                  {t(`modes.${mode}`)}
                </motion.span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-end gap-2">
          <button
            onClick={() => { }}
            className="flex h-18 w-76 items-center justify-between rounded-full bg-white p-1 cursor-pointer"
          >
            <span className="pl-7 text-2xl transition-colors duration-500">
              {t('Start')}
            </span>
            <span
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full',
                solidBgVariants({ mode: currentMode })
              )}
            >
              <ArrowRight
                className="h-9 w-9 text-white"
                strokeWidth={2.5}
              />
            </span>
          </button>

          <div className="flex flex-col items-start">
            <div className="pl-6 text-xl leading-6">
              {t('Cycles')}
            </div>

            <div
              className={cn(
                'flex h-18 w-44 items-center justify-between rounded-full',
                solidBgVariants({ mode: currentMode })
              )}
            >
              <button
                onClick={() => setCycles((c) => c)}
                className="flex h-16 w-16 items-center justify-center rounded-full cursor-pointer"
              >
                <ChevronLeft
                  className="h-9 w-9 text-white"
                  strokeWidth={2.5}
                />
              </button>

              <span className="text-4xl text-white">
                {cycles}
              </span>

              <button
                onClick={() => setCycles((c) => c)}
                className="flex h-16 w-16 items-center justify-center rounded-full cursor-pointer"
              >
                <ChevronRight
                  className="h-9 w-9 text-white"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;