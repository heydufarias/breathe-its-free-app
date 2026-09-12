import { useTranslation } from "react-i18next";
import { MotionFade } from "./motion/MotionFade";

interface HeaderProps {
  showInfoButton: boolean;
  onInfoButtonClick: () => void;
}

export function Header({ showInfoButton, onInfoButtonClick }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-[clamp(1.5rem,5vmin,2.5rem)] py-2">
      <div className="flex flex-col text-[clamp(1.5rem,4vmin,2rem)] font-semibold tracking-tight leading-none">
        <span>Breathe,</span>
        {/* O -mt-2 puxa essa linha para cima. 
            Aumente para -mt-3 ou diminua para -mt-1 para ajustar a colagem exata */}
        <span className="-mt-1.5">it is free.</span>
      </div>
      <MotionFade visible={showInfoButton}>
        <button
          onClick={onInfoButtonClick}
          className="text-[clamp(1rem,4vmin,1.5rem)] font-semibold cursor-pointer"
        >
          {t("info.howToUse.title")}
        </button>
      </MotionFade>
    </header>
  );
}