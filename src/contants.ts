export enum RARITY {
  SSR = "SSR",
  UR = "UR",
  LR = "LR",
}

export enum CLASS {
  EXTREME = "EXTREME",
  SUPER = "SUPER",
}

export enum CATEGORY {
  AGL = "AGL",
  TEQ = "TEQ",
  INT = "INT",
  STR = "STR",
  PHY = "PHY",
}

const ORB_NAMES = {
  HP: "HP",
  ATK: "ATK",
  DEF: "DEF",
  CA: "Combo Attack",
  CH: "Critical Hit",
  EVA: "Evasion",
  DEFB: "DEF Boost",
  ATKB: "ATK Boost",
  SAB: "Super Attack Boost",
  RECB: "Recovery Boost",
};

const fuseNames = (names: string[]) => {
  return names.join(" + ");
};

export const ORBS = [
  {
    id: "hp",
    name: ORB_NAMES.HP,
  },
  {
    id: "atk",
    name: ORB_NAMES.ATK,
  },
  {
    id: "def",
    name: ORB_NAMES.DEF,
  },
  {
    id: "ca",
    name: ORB_NAMES.CA,
  },
  {
    id: "ch",
    name: ORB_NAMES.CH,
  },
  {
    id: "eva",
    name: ORB_NAMES.EVA,
  },
  {
    id: "defb",
    name: ORB_NAMES.DEFB,
  },
  {
    id: "atkb",
    name: ORB_NAMES.ATKB,
  },
  {
    id: "sab",
    name: ORB_NAMES.SAB,
  },
  {
    id: "recb",
    name: ORB_NAMES.RECB,
  },
  {
    id: "ch_ca",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.CA]),
  },

  // ca +
  {
    id: "ca_atk",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.ATK]),
  },
  {
    id: "ca_eva",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.EVA]),
  },
  {
    id: "ca_atkb",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.ATKB]),
  },
  {
    id: "ca_defb",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.DEFB]),
  },
  {
    id: "ca_sab",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.SAB]),
  },
  {
    id: "ca_recb",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.RECB]),
  },
  {
    id: "ca_def",
    name: fuseNames([ORB_NAMES.CA, ORB_NAMES.DEF]),
  },

  // ch +
  {
    id: "ch_atk",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.ATK]),
  },
  {
    id: "ch_eva",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.EVA]),
  },
  {
    id: "ch_atkb",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.ATKB]),
  },
  {
    id: "ch_defb",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.DEFB]),
  },
  {
    id: "ch_sab",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.SAB]),
  },
  {
    id: "ch_recb",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.RECB]),
  },
  {
    id: "ch_def",
    name: fuseNames([ORB_NAMES.CH, ORB_NAMES.DEF]),
  },

  {
    id: "eva_def",
    name: fuseNames([ORB_NAMES.EVA, ORB_NAMES.DEF]),
  },
];
