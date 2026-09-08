import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Blob } from "./components/Blob";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { Session } from "./components/Session";
import { cn } from "./lib/utils";
import { layoutVariants } from "./lib/variants";
import { state } from "./state/state";

export default function App() {
  const currentMode = state.use((value) => value.currentMode);
  const isSessionActive = state.use((value) => value.sessionStage !== "idle");
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col h-dvh w-screen overflow-hidden font-helvetica",
        layoutVariants({ mode: currentMode })
      )}
    >
      <Header
        showInfoButton={!isSessionActive}
        onInfoButtonClick={() => setShowInfo(true)}
      />

      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="relative w-[98vmin] max-w-160 aspect-square translate-y-8">
          <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 22], fov: 30 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[75, 75, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, 2]} intensity={1.8} />
            <Blob />
          </Canvas>
        </div>
      </div>

      <Session />
      <Footer />

      <AnimatePresence>
        {showInfo && <Info onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}