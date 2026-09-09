import type { BreathMode } from "./types";

export const MODES: BreathMode[] = ["relax", "focus", "sleep"];

 interface ModeStyle {
  hex: string;
  text: string;
  bgPrimary: string;
  bgSurface: string;
  translate: string;
}

export const modeStyles: Record<BreathMode, ModeStyle> = {
  relax: {
    hex: "#2ECC71",
    text: "text-relax",
    bgPrimary: "bg-relax",
    bgSurface: "bg-emerald-50",
    translate: "translate-x-0",
  },
  focus: {
    hex: "#F9600C",
    text: "text-focus",
    bgPrimary: "bg-focus",
    bgSurface: "bg-orange-50",
    translate: "translate-x-full",
  },
  sleep: {
    hex: "#A56AD9",
    text: "text-sleep",
    bgPrimary: "bg-sleep",
    bgSurface: "bg-violet-50",
    translate: "translate-x-[200%]",
  },
};