import { CATEGORY, CLASS, RARITY } from "./contants";

export interface Hidden {
  offensive: boolean;
  defensive: boolean;
  support: boolean;
  additional: number;
  critical: number;
  evasion: number;
}

export interface Character {
  id: string;
  title: string;
  name: string;
  rarity: RARITY;
  class: CLASS;
  category: CATEGORY;
  hiddens: Hidden[];
}
