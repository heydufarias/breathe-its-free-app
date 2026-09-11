import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BackgroundBlob } from "./components/BackgroundBlob";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { Session } from "./components/Session";
import { modeStyles } from "./lib/consts";
import { cn } from "./lib/utils";
import { state } from "./state/state";

export default function App() {
  const currentMode = state.use((value) => value.currentMode);
  const isSessionActive = state.use((value) => value.sessionStage !== "idle");
  const [showInfo, setShowInfo] = useState(false);

  const openInfo = () => setShowInfo(true);
  const closeInfo = () => setShowInfo(false);

  // Sincroniza a cor do fundo da tela (body) com o modo atual
  // Isso resolve a faixa branca que aparece no overscroll do celular
  useEffect(() => {
    const bgClass = modeStyles[currentMode].bgSurface;

    // Adiciona a classe atualizada ao body
    document.body.classList.add(bgClass);
    document.body.style.transition = "background-color 500ms"; // Suaviza a transição

    // Função de limpeza para remover a classe antiga quando o modo mudar
    return () => {
      document.body.classList.remove(bgClass);
    };
  }, [currentMode]);

  return (
    <div
      className={cn(
        // Substituído 'relative h-dvh w-screen' por 'fixed inset-0'
        "fixed inset-0 flex flex-col font-helvetica transition-colors duration-500 overflow-hidden",
        modeStyles[currentMode].bgSurface,
        modeStyles[currentMode].text
      )}
    >
      <Header
        showInfoButton={!isSessionActive}
        onInfoButtonClick={openInfo}
      />

      <BackgroundBlob />
      <Session />

      <Footer />

      <AnimatePresence>
        {showInfo && <Info onClose={closeInfo} />}
      </AnimatePresence>
    </div>
  );
} 