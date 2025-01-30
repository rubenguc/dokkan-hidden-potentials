/* eslint-disable @next/next/no-img-element */
import { Character } from "@/interfaces";

type SimpleCharacter = Pick<Character, "id" | "category" | "class" | "rarity">;

interface CharacterProps extends SimpleCharacter {
  containerClassName: string;
}

const IMAGE_URL = process.env.IMAGE_URL_SERVER || process.env.NEXT_PUBLIC_IMAGE_URL_SERVER

export default function CharacterCard({
  category,
  id,
  containerClassName,
  rarity,
  class: _class,
}: CharacterProps) {
  return (
    <div className={containerClassName}>
      <img
        className="absolute top-0 left-0 scale-[.80] w-full"
        src={`/assets/base/${category}.webp`}
        alt={`category ${category}`}
      />

      <img
        className="absolute bottom-1 left-2 scale-125  z-50"
        src={`/assets/rarity/${rarity.toLowerCase()}.webp`}
        alt={`rarity ${rarity}`}
      />

      <img
        className="absolute -top-9 -right-10 scale-[.47]  z-50"
        src={`/assets/type/${_class?.toLowerCase()}_${category?.toLowerCase()}.webp`}
        alt={`type ${rarity}`}
      />

      <img
        className="absolute -top-[7px] left-0 w-full"
        src={`${IMAGE_URL}/${id}.webp`}
        alt="rarity"
      />
    </div>
  );
}
