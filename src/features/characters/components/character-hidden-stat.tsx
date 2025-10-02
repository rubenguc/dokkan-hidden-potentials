import Image from "next/image";

interface CharacterHiddenStatProps {
  stat: "add" | "crit" | "eva";
  value: number;
}

const STATS = {
  add: "/assets/hidden/add.webp",
  crit: "/assets/hidden/crit.webp",
  eva: "/assets/hidden/eva.webp",
};

export function CharacterHiddenStat({ stat, value }: CharacterHiddenStatProps) {
  return (
    <div className="flex items-center gap-1">
      <Image src={STATS[stat]} width={35} height={35} alt="hidden icon" />
      <span className="text-2xl  font-semibold text-white">{value}</span>
    </div>
  );
}
