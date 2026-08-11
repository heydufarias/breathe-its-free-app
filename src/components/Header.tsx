export function Header({ showInfoButton, onInfoButtonClick }: { showInfoButton: boolean, onInfoButtonClick: () => void }) {
  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-[clamp(1.5rem,5vw,2.5rem)] pt-4 z-10">
      <div className="flex flex-col text-4xl font-semibold tracking-tight leading-7">
        <span>Breathe,</span>
        <span>it is free.</span>
      </div>

      {showInfoButton && (
        <button
          onClick={onInfoButtonClick}
          className="text-2xl font-semibold cursor-pointer"
        >
          Info
        </button>
      )}

    </header>
  );
}