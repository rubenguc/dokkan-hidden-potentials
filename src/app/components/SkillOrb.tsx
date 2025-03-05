import Image from "next/image";

interface SkillOrbProps {
  base: "bronze" | "silver" | "gold";
  value: string;
}

export const SkillOrb = ({ base, value }: SkillOrbProps) => {
  const _base = {
    bronze: "/assets/orbs/base/bronze.webp",
    silver: "/assets/orbs/base/silver.png",
    gold: "/assets/orbs/base/gold.webp",
  };

  const getIcon = () => {
    const icon = value.includes("+") ? value.split("_")[0] + '_' + value.split("_")[1] : value;

    return `/assets/orbs/${base}/${icon}.webp`;
  };

  return (
    <div className="flex flex-col items-center relative">
      <Image src={_base[base]} width={40} height={40} alt="hidden icon" />
      <Image
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        src={getIcon()}
        width={40}
        height={40}
        alt="hidden icon"
        quality={100}
      />
    </div>
  );
};
