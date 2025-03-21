import Message from "@/components/Message";
import { connectToDatabase } from "@/lib/database";
import Character from "@/lib/model";
import { CharacterHidden } from "./components/CharacterHidden";
import SearchForm from "./components/SearchForm";
import Pagination from "./components/Pagination";
import { SearchParams } from "@/interfaces";

export const dynamic = "force-dynamic";

export async function fetchCharacters({
  page = 1,
  name,
  rarity,
  characterClass,
  category,
}: SearchParams) {
  const limit = 10;
  const skip = (page - 1) * limit;

  await connectToDatabase();

  const query = {
    ...(name && { name: { $regex: name, $options: "i" } }),
    ...(rarity && { rarity }),
    ...(characterClass && { class: characterClass }),
    ...(category && { category }),
  };

  const characters = await Character.find(query)
    .sort({
      last_awakening: -1,
    })
    .skip(skip)
    .limit(limit);

  const totalCharacters = await Character.countDocuments(query);
  const totalPages = Math.ceil(totalCharacters / limit);

  return { characters, totalCharacters, totalPages };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const {
    page: searchPage,
    name,
    rarity,
    class: characterClass,
    category,
  } = await searchParams;

  const page = parseInt(searchPage) || 1;
  const { characters, totalPages } = await fetchCharacters({
    page,
    name,
    rarity,
    characterClass,
    category,
  });

  return (
    <div className="w-full pb-12">
      <h1 className="text-center mt-10 font-bold text-4xl">{`Dokkan Battle Hidden potential`}</h1>

      <div className="max-w-5xl w-full mx-auto rounded-xl border border-[#b5c3ac] p-10 md:p-14 bg-[#1b4104]">
        <SearchForm />

        <div className="grid lg:grid-cols-2 w-fit mx-auto mt-10 gap-5">
          {characters.map((character) => (
            <CharacterHidden key={character.id} character={character} />
          ))}
        </div>
      </div>

      <Pagination totalPages={totalPages} page={Number(searchPage)} />

      <Message />
    </div>
  );
}
