import { useTranslation } from "react-i18next";
import { MotionFade } from "./MotionFade";

interface HeaderProps {
  showInfoButton: boolean;
  onInfoButtonClick: () => void;
}

export function Header({ showInfoButton, onInfoButtonClick }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-[clamp(1.5rem,5vw,2.5rem)] pt-4 z-10">
      <div className="flex flex-col text-4xl font-semibold tracking-tight leading-7">
        <span>Breathe,</span>
        <span>it is free.</span>
      </div>

      <MotionFade visible={showInfoButton}>
        <button
          onClick={onInfoButtonClick}
          className="text-2xl font-semibold cursor-pointer"
        >
          {t("info.howToUse.title")}
        </button>
      </MotionFade>
    </header>
  );
}