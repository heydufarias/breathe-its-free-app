export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-[clamp(1.5rem,5vw,2.5rem)] pt-4">
      <div className="flex flex-col text-3xl font-semibold tracking-tight leading-7">
        <span>Breathe,</span>
        <span>it's free.</span>
      </div>

      <button
        className="text-2xl font-semibold cursor-pointer"
      >
        Info
      </button>

    </header>
  );
}