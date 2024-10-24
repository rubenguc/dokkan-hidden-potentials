import CharactCard from "@/components/CharacterCard";
import Message from "@/components/Message";
import { CATEGORY, CLASS, RARITY } from "@/contants";
import { connectToDatabase } from "@/lib/database";
import Character from "@/lib/model";
import { Field, Label, Select } from "@headlessui/react";

export const dynamic = "force-dynamic";

export async function fetchCharacters({
  page = 1,
  name,
  rarity,
  characterClass,
  category,
}) {
  const limit = 10;
  const skip = (page - 1) * limit;

  await connectToDatabase();

  // Crear el query dinámico
  const query = {
    ...(name && { name: { $regex: name, $options: "i" } }),
    ...(rarity && { rarity }),
    ...(characterClass && { class: characterClass }),
    ...(category && { category }),
  };

  // Obtener los personajes
  const characters = await Character.find(query).sort({
    id: "desc"
  }).skip(skip).limit(limit);

  // Calcular el número total de personajes y páginas
  const totalCharacters = await Character.countDocuments(query);
  const totalPages = Math.ceil(totalCharacters / limit);

  return { characters, totalCharacters, totalPages };
}

const HiddenStat = ({
  stat,
  value,
}: {
  stat: "add" | "crit" | "eva";
  value: number;
}) => {
  const stats = {
    add: "/assets/add.webp",
    crit: "/assets/crit.webp",
    eva: "/assets/eva.webp",
  };

  return (
    <div className="flex flex-col items-center">
      <img src={stats[stat]} width={40} height={40} />
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

export default async function Home({ searchParams }) {
  const {
    page: searchPage,
    name,
    rarity,
    class: characterClass,
    category,
  } = await searchParams;

  const page = parseInt(searchPage) || 1;

  const searchQuery = name || "";

  // Llamar a la función que maneja la lógica de búsqueda
  const { characters, totalCharacters, totalPages } = await fetchCharacters({
    page,
    name,
    rarity,
    characterClass,
    category,
  });

  return (
    <div className="w-full">
      <h1 className="text-center mt-10 font-bold text-4xl">{`Playmaker's Hidden potential`}</h1>

      <div className="max-w-5xl w-full mx-auto rounded bg-gray-600 p-10 md:p-14">
        <form
          className="mx-auto w-fit flex flex-col  gap-4 items-center"
          method="get"
          action="/"
        >
          <div className="flex gap-3">
            <Field>
              <Label className="capitalize">class</Label>
              <Select
                name="class"
                defaultValue={characterClass}
                className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
              >
                <option value={""}>ALL</option>
                {Object.keys(CLASS).map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label className="capitalize">category</Label>
              <Select
                defaultValue={category}
                name="category"
                className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
              >
                <option value={""}>ALL</option>
                {Object.keys(CATEGORY).map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label className="capitalize">rarity</Label>
              <Select
                defaultValue={rarity}
                name="rarity"
                className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
              >
                <option value={""}>ALL</option>
                {Object.keys(RARITY).map((rarityName) => (
                  <option key={rarityName} value={rarityName}>
                    {rarityName}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="flex gap-2">
            <input
              className="rounded border p-1 text-black"
              type="text"
              name="name"
              placeholder="Search by name"
              defaultValue={searchQuery}
            />
            <button
              className="bg-green-600 p-2 rounded font-bol h-fit"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>

        {/* Mostrar resultados */}

        <div className="grid lg:grid-cols-2 w-fit mx-auto mt-10 gap-5">
          {characters.map((character) => (
            <div
              key={character.id}
              className="flex flex-col md:flex-row md:gap-5 max-w-xl border border-neutral-500/50 rounded-xl"
            >
              <CharactCard
                id={character.id}
                category={character.category}
                rarity={character.rarity}
                containerClassName="relative h-44 w-44 md:flex-1/2 mx-auto md:mx-0"
              />

              <div className="flex flex-col gap-3 py-4 flex-1 items-center md:justify-start">
                <div className="flex flex-col">
                  <span className="text text-center text-neutral-300">
                    {character.title}
                  </span>
                  <span className="text-xl text-center">{character.name}</span>

                </div>
                {character.hiddens.map((hidden, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {hidden?.additional > 0 && (
                      <HiddenStat stat="add" value={hidden.additional} />
                    )}
                    {hidden?.critical > 0 && (
                      <HiddenStat stat="crit" value={hidden.critical} />
                    )}
                    {hidden?.evasion > 0 && (
                      <HiddenStat stat="eva" value={hidden.evasion} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Message />

      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <a
            key={index}
            href={`/?page=${index + 1}&name=${name || ""}&rarity=${rarity || ""
              }&class=${characterClass || ""}&category=${category || ""}`}
            className={`p-2 rounded ${page === index + 1 ? "bg-blue-500" : "bg-gray-500"
              }`}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div >
  );
}
