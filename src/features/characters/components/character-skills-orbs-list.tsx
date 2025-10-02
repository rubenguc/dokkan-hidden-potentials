import { Character } from "@/interfaces";
import { CharacterSkillOrb } from "./character-skill-orb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOrbName } from "@/constants";

interface CharacterSkillOrbsListontainerProps {
  orbs: Character["orbs"];
}

export const CharacterSkillOrbsList = ({
  orbs,
}: CharacterSkillOrbsListontainerProps) => {
  if (orbs.length === 0) return null;

  return (
    <div className="flex gap-2 mx-auto">
      <CharacterSkillOrb base="bronze" value={orbs[0].bronze} />
      <CharacterSkillOrb base="silver" value={orbs[0].silver} />
      <CharacterSkillOrb base="gold" value={orbs[0].gold} />
    </div>
  );
};
