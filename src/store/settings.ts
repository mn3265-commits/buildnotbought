// App-level settings — exposed as configurable design props in the prototype.
// Fixed here (no settings UI shipped in the final design).
export const SETTINGS = {
  restSeconds: 120,
  weekGoal: 5,
  showTips: true,
} as const

// Today is fixed to a Legs day (Wednesday) to match the seeded demo state.
export const TODAY_TYPE = 'Legs' as const
export const TODAY_IDX = 2 // Wed (Mon=0)
