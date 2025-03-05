import { Character } from "@/interfaces";
import { SkillOrb } from "./SkillOrb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOrbName } from "@/contants";

interface SkillOrbsContainerProps {
  orbs: Character["orbs"];
}

export const SkillOrbs = ({ orbs }: SkillOrbsContainerProps) => {
  if (orbs.length === 0) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <SkillOrb base="bronze" value={orbs[0].bronze} />
            <SkillOrb base="silver" value={orbs[0].silver} />
            <SkillOrb base="gold" value={orbs[0].gold} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white p-4 ">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center ">
              <SkillOrb base="bronze" value={orbs[0].bronze} />

              <div className="flex flex-col gap-1 max-w-[65ch]">
                {orbs[0].bronzeIsExclusive && (
                  <span className="text-xs "> [exclusive] </span>
                )}
                <span className="font-bold"> {getOrbName(orbs[0].bronze)}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <SkillOrb base="silver" value={orbs[0].silver} />
              <div className="flex flex-col gap-1 max-w-[65ch]">
                {orbs[0].silverIsExclusive && (
                  <span className="text-xs "> [exclusive] </span>
                )}
                <span className="font-bold"> {getOrbName(orbs[0].silver)}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <SkillOrb base="gold" value={orbs[0].gold} />
              <div className="flex flex-col gap-1 max-w-[65ch]">
                {orbs[0].goldIsExclusive && (
                  <span className="text-xs "> [exclusive] </span>
                )}
                <span className="font-bold"> {getOrbName(orbs[0].gold)}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
