import type { BreathMode, BreathPhaseLabel } from "./types";

export interface BreathPhase {
  label: BreathPhaseLabel;
  seconds: number;
}

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

export function buildSequence(mode: BreathMode, cycles: number): BreathPhase[] {
  const prepareStep: BreathPhase = { label: "exhale", seconds: 3 };
  const pattern = breathingPatterns[mode];
  const cycleSteps = Array.from({ length: cycles }, () => pattern).flat();

  return [prepareStep, ...cycleSteps];
}