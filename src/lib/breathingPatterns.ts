import type { BreathMode, BreathPhaseLabel } from "./types";

export interface BreathPhase {
  label: BreathPhaseLabel;
  seconds: number;
}

export const preparePhase: BreathPhase = {
  label: "exhale",
  seconds: 3,
};

export const breathingPatterns: Record<BreathMode, BreathPhase[]> = {
  relax: [
    { label: "inhale", seconds: 5 },
    { label: "exhale", seconds: 5 },
  ],
  focus: [
    { label: "inhale", seconds: 4 },
    { label: "hold", seconds: 4 },
    { label: "exhale", seconds: 4 },
    { label: "hold", seconds: 4 },
  ],
  sleep: [
    { label: "inhale", seconds: 4 },
    { label: "hold", seconds: 7 },
    { label: "exhale", seconds: 8 },
  ],
};