import type { BreathMode } from "./types";

export const MODES: BreathMode[] = ["relax", "focus", "sleep"];

export const modeColor: Record<string, string> = {
  relax: "#2ECC71",
  focus: "#F9600C",
  sleep: "#A56AD9",
};