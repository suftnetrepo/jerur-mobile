// Ported from premeal-mobile's per-screen shadow constants, centralized
// here instead of redefined in every file. Same visual result — soft,
// borderless elevation — just not copy-pasted five times.
export const SHADOW_SOFT = {
  shadowColor: "#1C1917",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 3,
};

export const SHADOW_CHIP = {
  shadowColor: "#1C1917",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

export const SHADOW_CARD = {
  shadowColor: "#1C1917",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.09,
  shadowRadius: 22,
  elevation: 5,
};

export const SHADOW_HERO = {
  shadowColor: "#1C1917",
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.18,
  shadowRadius: 28,
  elevation: 10,
};

export function shadowCta(color: string) {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  };
}
