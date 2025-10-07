import { Card } from "@/components/ui/card";
import { CharacterImage } from "./character-image";
import { Character } from "@/interfaces";
import { CharacterHiddenStat } from "./character-hidden-stat";
import { CharacterSkillOrbsList } from "./character-skills-orbs-list";

interface CharacterHiddenProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterHiddenProps) {
  return (
    <Card className="px-3 py-3 gap-3 bg-[#082c09] border-green-400 relative z-10">
      <div className="flex items-center py-2 flex-6/12">
        <CharacterImage
          id={character.id}
          category={character.category}
          rarity={character.rarity}
          class={character.class}
          containerClassName="relative h-25 w-25"
        />
        <div className="flex flex-col justify-center gap-3 flex-6/12">
          {character.hiddens.map((hidden, index) => (
            <div key={index} className="flex gap-3 justify-center">
              <CharacterHiddenStat stat="add" value={hidden.additional} />
              <CharacterHiddenStat stat="crit" value={hidden.critical} />
              <CharacterHiddenStat stat="eva" value={hidden.evasion} />
            </div>
          ))}
          <CharacterSkillOrbsList orbs={character.orbs} />
        </div>
      </div>
    </Card>
  );
}
