import CharacterCard from "@/components/shared/CharacterCard";
import { Character } from "@/interfaces";
import Image from "next/image";
import { SkillOrbs } from "./SkillOrbs";

const HiddenStat = ({
  stat,
  value,
}: {
  stat: "add" | "crit" | "eva";
  value: number;
}) => {
  const stats = {
    add: "/assets/hidden/add.webp",
    crit: "/assets/hidden/crit.webp",
    eva: "/assets/hidden/eva.webp",
  };

  return (
    <div className="flex flex-col items-center">
      <Image src={stats[stat]} width={40} height={40} alt="hidden icon" />
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

interface CharacterHiddenProps {
  character: Character;
}

export const CharacterHidden = ({ character }: CharacterHiddenProps) => {
  return (
    <div className="flex flex-col items-center md:flex-row md:gap-2 max-w-xl border border-neutral-500/90 rounded px-1 bg-[#1f251c]/60">
      <CharacterCard
        id={character.id}
        category={character.category}
        rarity={character.rarity}
        class={character.class}
        containerClassName="relative h-40 w-40 md:flex-1/2 mx-auto md:mx-0"
      />

      <div className="flex flex-col gap-3 py-4 flex-1 items-center md:justify-start">
        <div className="flex flex-col bg-[#4a4f4a]/45 rounded-lg p-1">
          <span className="text text-center text-neutral-300 text-sm">
            {character.title}
          </span>
          <span className="text text-center font-bold">{character.name}</span>
        </div>
        {character.hiddens.map((hidden, index) => (
          <div key={index} className="flex items-center gap-2">
            <HiddenStat stat="add" value={hidden.additional} />
            <HiddenStat stat="crit" value={hidden.critical} />
            <HiddenStat stat="eva" value={hidden.evasion} />
          </div>
        ))}
        <SkillOrbs orbs={character.orbs} />
      </div>
    </div>
  );
};
