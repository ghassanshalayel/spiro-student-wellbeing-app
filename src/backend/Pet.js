// src/backend/Pet.js

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const todayStr = () => new Date().toISOString().split("T")[0];

export function stageFromLevel(level) { //can change these names
  if (level >= 10) return "Expert";
  if (level >= 6) return "Buddy";
  if (level >= 3) return "Hatchling";
  return "Egg";
}

function difficultyMultiplier(difficulty) {
  // can change this later
  switch (difficulty) {
    case "Beginner": return 1.0;
    case "Intermediate": return 1.2;
    case "Advanced": return 1.4;
    case "GOD MODE": return 1.6;
    default: return 1.0;
  }
}

/**
 * Ensures pet/stats exist and fixes field name mismatch:
 * - supports old "lastUpdate" and new "lastUpdated"
 * Mutates and returns the same data object.
 */
export function normalisePetData(data) {
  if (!data.stats) {
    data.stats = { lifetimeSteps: 0, weeklySteps: 0, dailySteps: 0, level: 1, currentXp: 0 };
  }
  if (typeof data.stats.level !== "number") data.stats.level = 1;
  if (typeof data.stats.currentXp !== "number") data.stats.currentXp = 0;

  if (!data.pet) {
    data.pet = { name: "", stage: "Egg", happiness: 100, lastUpdated: todayStr() };
  }

  // Field migration
  if (data.pet.lastUpdate && !data.pet.lastUpdated) data.pet.lastUpdated = data.pet.lastUpdate;
  if (!data.pet.lastUpdated) data.pet.lastUpdated = todayStr();

  if (typeof data.pet.happiness !== "number") data.pet.happiness = 100;
  if (!data.pet.stage) data.pet.stage = stageFromLevel(data.stats.level);

  return data;
}

function dayDiff(a, b) {
  // a, b are YYYY-MM-DD or ISO
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  if (Number.isNaN(da) || Number.isNaN(db)) return 0;
  return Math.floor((db - da) / (1000 * 60 * 60 * 24));
}

/**
 * Apply "hasn't walked" decay once per day when app opens.
 * Example: -5 happiness per missed day, capped at 30 per launch.
 */
export function applyPetDecay(data, now = todayStr()) {
  normalisePetData(data);

  const last = data.pet.lastUpdated;
  const diffDays = dayDiff(last, now);

  if (diffDays >= 1) {
    const decay = clamp(diffDays * 5, 0, 30);
    data.pet.happiness = clamp(data.pet.happiness - decay, 0, 100);
    data.pet.lastUpdated = now;
  }

  return data;
}

/**
 * Apply rewards from steps gained (call this inside Steps.js when diff steps added).
 * - XP: 1 per 100 steps (scaled by difficulty)
 * - Level up: 100 XP per level
 * - Happiness: +2 per 500 steps
 */
export function applyStepsReward(data, stepsAdded) {
  normalisePetData(data);

  if (!stepsAdded || stepsAdded <= 0) return data;

  const mult = difficultyMultiplier(data.settings?.difficulty);
  const baseXp = Math.floor(stepsAdded / 100);
  const xpGain = Math.floor(baseXp * mult);

  const happinessGain = Math.floor(stepsAdded / 500) * 2;

  // XP + level
  let xp = data.stats.currentXp + xpGain;
  let level = data.stats.level;

  while (xp >= 100) {
    xp -= 100;
    level += 1;
  }

  data.stats.currentXp = xp;
  data.stats.level = level;

  // Pet updates
  data.pet.happiness = clamp(data.pet.happiness + happinessGain, 0, 100);
  data.pet.stage = stageFromLevel(level);
  data.pet.lastUpdated = todayStr();

  return data;
}