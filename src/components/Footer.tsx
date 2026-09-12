import { useTranslation } from "react-i18next";
import type { Language } from "../lib/types";
import { motion } from "framer-motion";

export function Footer() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <footer className="flex items-center justify-between px-[clamp(1.5rem,5vmin,2.5rem)] py-5">
      <div className="flex text-[clamp(1rem,4vmin,1.5rem)] font-semibold tracking-tight leading-none gap-3">
        {(["en", "pt-BR"] as Language[]).map((language) => {
          return (
            <button
              key={language}
              onClick={() => i18n.changeLanguage(language)}
              className="relative cursor-pointer"
            >
              {language === "en" ? "En" : "Pt-br"}

              {current === language && (
                <motion.div
                  layoutId="active-underline"

                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-current"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[clamp(1rem,4vmin,1.5rem)] font-semibold leading-none">
        ©2026
      </div>
    </footer>
  );
}