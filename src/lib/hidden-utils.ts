export const RARITY: Record<number, string> = {
  3: "SSR",
  4: "UR",
  5: "LR",
};

export const CLASS: Record<number, string> = {
  1: "SUPER",
  2: "EXTREME",
};

export const CATEGORY: Record<number, string> = {
  0: "AGL",
  1: "TEQ",
  2: "INT",
  3: "STR",
  4: "PHY",
};

export const getClassAndCategory = (element: number) => {
  const [classNumber, categoryNumber] = element.toString().split("");

  return {
    class: CLASS[Number(classNumber)],
    category: CATEGORY[Number(categoryNumber)],
  };
};

export const getRarity = (rarity: number) => {
  return RARITY[rarity];
};
