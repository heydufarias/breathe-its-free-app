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
      <div className="flex flex-col text-[clamp(1.8rem,4vmin,2rem)] font-semibold tracking-tight leading-none">
        <span>Breathe,</span>
        <span className="-mt-[6px]">it is free.</span>
      </div>
      <MotionFade visible={showInfoButton}>
        <button
          onClick={onInfoButtonClick}
          className="text-[clamp(1.4rem,4vmin,1.5rem)] font-semibold cursor-pointer"
        >
          {t("info.howToUse.title")}
        </button>
      </MotionFade>
    </header>
  );
}