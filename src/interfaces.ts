import { CATEGORY, CLASS, RARITY } from "@/constants";

export interface Hidden {
  additional: number;
  critical: number;
  evasion: number;
}

export interface Orb {
  bronze: string;
  bronzeIsExclusive: boolean;
  silver: string;
  silverIsExclusive: boolean;
  gold: string;
  goldIsExclusive: boolean;
}

export interface Character {
  id: string;
  title: string;
  name: string;
  rarity: RARITY;
  class: CLASS;
  category: CATEGORY;
  hiddens: Hidden[];
  orbs: Orb[];
  open_at: string;
  last_awakening: string;
  hasEZA: boolean;
  hasSEZA: boolean;
}

export interface CharacterForm {
  json: string;
  hiddens: Hidden[];
  orbs: Orb[];
}

export interface CardInfo {
  card: {
    id: number;
    name: string;
    character_id: number;
    rarity: number;
    title: string;
    open_at: string;
    element: number;
  };
  optimal_awakening_growths?: {
    open_at: string;
  }[];
}

export interface SearchParams {
  page: string;
  name: string;
  rarity: string;
  class: string;
  category: string;
}
