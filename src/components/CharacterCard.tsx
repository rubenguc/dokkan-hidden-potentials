import { Character } from "@/interfaces";

const getbase = (type: string) => {
  const base = {
    AGL: '00',
    TEQ: '01',
    INT: '02',
    STR: '03',
    PHY: '04'
  }

  return `https://glben.dokkaninfo.com/assets/global/en/layout/en/image/character/character_thumb_bg/cha_base_${base[type]}_04.png`;
};

const getIcon = (id: string) => {
  return `https://glben.dokkaninfo.com/assets/global/en/character/thumb/card_${Number(id) - 1
    }_thumb.png`;
};

interface CharacterProps extends Character {
  containerClassName: string
}

export default function CharacterCard({ category, id, containerClassName }: CharacterProps) {
  return (
    <div className={containerClassName}>
      <img
        className="absolute top-0 left-0 scale-[.80] w-full"
        src={getbase(category)}
      />
      <img
        className="absolute -top-[7px] left-0 w-full"
        src={getIcon(id)}
      />
    </div>
  )
}
