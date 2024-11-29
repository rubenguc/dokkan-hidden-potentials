/* eslint-disable @next/next/no-img-element */

import { RARITY } from "@/contants";
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

const getIcon = ({ id, rarity }: CharacterProps) => {
  const _id = rarity === RARITY.SSR ? id : (Number(id) - 1)

  return `https://glben.dokkaninfo.com/assets/global/en/character/thumb/card_${_id}_thumb.png`;
};

const getRarity = ({ rarity }: CharacterProps) => {
  return `/assets/${rarity.toLowerCase()}.webp`
}

const getType = ({ class: _class, category }: CharacterProps) => {
  return `/assets/${_class?.toLowerCase()}_${category?.toLowerCase()}.webp`
}

interface CharacterProps extends Partial<Character> {
  containerClassName: string
}

export default function CharacterCard({ category, id, containerClassName, rarity, class: _class, }: CharacterProps) {


  return (
    <div className={containerClassName}>
      <img
        className="absolute top-0 left-0 scale-[.80] w-full"
        src={getbase(category as string)}
        alt={`category ${category}`}
      />

      <img
        className="absolute bottom-1 left-2 scale-125  z-50"
        src={getRarity({ rarity })}
        alt={`rarity ${rarity}`}
      />


      <img
        className="absolute -top-9 -right-10 scale-[.47]  z-50"
        src={getType({ class: _class, category })}
        alt={`type ${rarity}`}
      />

      <img
        className="absolute -top-[7px] left-0 w-full"
        src={getIcon({ id, rarity })}
        alt=""
      />
    </div>
  )
}
