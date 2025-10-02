import { Character } from "@/interfaces";

type SimpleCharacter = Pick<Character, "id" | "category" | "class" | "rarity">;

interface CharacterProps extends SimpleCharacter {
  containerClassName: string;
}

const IMAGE_URL =
  process.env.IMAGE_URL_SERVER || process.env.NEXT_PUBLIC_IMAGE_URL_SERVER;

export function CharacterImage({
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
        id="rarity"
        className="absolute -bottom-[7px] -left-2 scale-80  z-50"
        src={`/assets/rarity/${rarity.toLowerCase()}.webp`}
        alt={`rarity ${rarity}`}
      />

      <img
        id="type"
        className="absolute -top-9 -right-8.5 scale-[.35]  z-50"
        src={`/assets/type/${_class?.toLowerCase()}_${category?.toLowerCase()}.webp`}
        alt={`type ${category}`}
      />

      <img
        className="absolute -top-[6px] left-0 w-full"
        src={`${IMAGE_URL}/${id}.webp`}
        alt="image"
      />
    </div>
  );
}
