import { entity } from "simpler-state";
import type { BreathPhase } from "../lib/breathingPatterns";
import { breathingPatterns } from "../lib/breathingPatterns";
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

const currentMode = (localStorage.getItem("breathMode") as BreathMode) || "relax";
const cycles = Number(localStorage.getItem("cycles")) || 3;

const initialState: State = {
  currentMode,
  cycles,
  sessionStage: "idle",
  currentPhase: breathingPatterns[currentMode][0],
  phaseIndex: 0,
  secondsLeft: 0,
  currentCycle: 1,
  isTransitioning: false,
};

export const state = entity<State>(initialState);