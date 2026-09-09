import { breathingPatterns, preparePhase } from "../lib/breathingPatterns";
import type { BreathMode } from "../lib/types";
import { state } from "./state";

export function setMode(mode: BreathMode) {
  localStorage.setItem("breathMode", mode);

  state.set((value) => ({
    ...value,
    currentMode: mode,
    currentPhase:
      value.sessionStage === "prepare"
        ? preparePhase
        : breathingPatterns[mode][value.phaseIndex],
  }));
}

export function decreaseCycles() {
  state.set((value) => ({
    ...value,
    cycles: Math.max(3, value.cycles - 1),
  }));
}

export function increaseCycles() {
  state.set((value) => ({
    ...value,
    cycles: Math.min(9, value.cycles + 1),
  }));
}

export function startSession() {
  state.set((value) => ({
    ...value,
    sessionStage: "prepare",
    currentCycle: 1,
    phaseIndex: 0,
    currentPhase: preparePhase,
    secondsLeft: preparePhase.seconds,
    isTransitioning: true,
  }));

  setTimeout(() => {
    state.set((value) => ({
      ...value,
      isTransitioning: false,
    }));
  }, 500);
}

export function finishSession() {
  state.set((value) => ({
    ...value,
    sessionStage: "idle",
    currentPhase: undefined,
    phaseIndex: 0,
    currentCycle: 1,
    secondsLeft: 0,
    isTransitioning: true,
  }));

  setTimeout(() => {
    state.set((value) => ({
      ...value,
      isTransitioning: false,
    }));
  }, 500);
}

export function advanceSession() {
  state.set((value) => {
    if (value.secondsLeft > 1) {
      return {
        ...value,
        secondsLeft: value.secondsLeft - 1,
      };
    }

    const phases = breathingPatterns[value.currentMode];

    if (value.sessionStage === "prepare") {
      return {
        ...value,
        sessionStage: "active",
        currentCycle: 1,
        phaseIndex: 0,
        currentPhase: phases[0],
        secondsLeft: phases[0].seconds,
      };
    }

    const nextPhaseIndex = value.phaseIndex + 1;

    if (nextPhaseIndex < phases.length) {
      const nextPhase = phases[nextPhaseIndex];
      return {
        ...value,
        phaseIndex: nextPhaseIndex,
        currentPhase: nextPhase,
        secondsLeft: nextPhase.seconds,
      };
    }

    const nextCycle = value.currentCycle + 1;

    if (nextCycle <= value.cycles) {
      return {
        ...value,
        currentCycle: nextCycle,
        phaseIndex: 0,
        currentPhase: phases[0],
        secondsLeft: phases[0].seconds,
      };
    }

    return {
      ...value,
      sessionStage: "done",
    };
  });
}

export function resetToIdle() {
  state.set((value) => ({
    ...value,
    sessionStage: "idle",
  }));
}