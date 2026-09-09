import type { BreathMode } from "./types";

export const MODES: BreathMode[] = ["relax", "focus", "sleep"];

 interface ModeStyle {
  hex: string;
  text: string;
  bg: string;
  bgSoft: string;
  translate: string;
}

export const modeStyles: Record<BreathMode, ModeStyle> = {
  relax: {
    hex: "#2ECC71",
    text: "text-relax",
    bg: "bg-relax",
    bgSoft: "bg-emerald-50",
    translate: "translate-x-0",
  },
  focus: {
    hex: "#F9600C",
    text: "text-focus",
    bg: "bg-focus",
    bgSoft: "bg-orange-50",
    translate: "translate-x-full",
  },
  sleep: {
    hex: "#A56AD9",
    text: "text-sleep",
    bg: "bg-sleep",
    bgSoft: "bg-violet-50",
    translate: "translate-x-[200%]",
  },
};