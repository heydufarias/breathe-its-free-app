import { entity } from "simpler-state";
import { breathingPatterns } from "../lib/breathingPatterns";
import type { BreathPhase } from "../lib/breathingPatterns";
import type { BreathMode, SessionStage } from "../lib/types";

export interface State {
  currentMode: BreathMode;
  cycles: number;
  sessionStage: SessionStage;
  currentPhase?: BreathPhase;
  phaseIndex: number;
  secondsLeft: number;
  currentCycle: number;
  isTransitioning: boolean;
}

const currentMode =
  (localStorage.getItem("breathMode") as BreathMode) || "relax";

export const state = entity<State>({
  currentMode,
  cycles: 3,
  sessionStage: "idle",
  currentPhase: breathingPatterns[currentMode][0],
  phaseIndex: 0,
  secondsLeft: 0,
  currentCycle: 1,
  isTransitioning: false,
});