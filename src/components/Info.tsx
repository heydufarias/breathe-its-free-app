import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../lib/utils";
import { layoutVariants } from "../lib/variants";
import { MODES } from "../lib/consts";

interface InfoProps {
  onClose: () => void;
}

export function Info({ onClose }: InfoProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute flex items-center justify-center p-6 inset-0 bg-black/10 text-[#afb5b3] backdrop-blur-[2px] z-40"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative flex flex-col max-h-[80vh] w-full max-w-md p-8 bg-white gap-8 rounded-4xl overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 cursor-pointer"
        >
          <X className="h-9 w-9" strokeWidth={2.5} />
        </button>

        <section>
          <p className="mb-2 text-xl font-bold tracking-tight">{t("info.howToUse.title")}</p>
          <p className="text-lg font-semibold">{t("info.howToUse.text")}</p>
        </section>

        <section>
          <p className="mb-4 text-xl font-bold tracking-tight">{t("info.modesSection.title")}</p>
          <div className="flex flex-col gap-5">
            {MODES.map((mode) => (
              <div key={mode}>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-lg font-bold", layoutVariants({ mode }))}>
                    {t(`modes.${mode}`)}
                  </span>
                  <span className="text-xs font-bold text-[#aab0ad] tracking-wide">
                    {t(`info.modesSection.${mode}.pattern`)}
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold">
                  {t(`info.modesSection.${mode}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}