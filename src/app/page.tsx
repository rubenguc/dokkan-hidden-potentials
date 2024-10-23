import Message from "@/components/Message";
import { connectToDatabase } from "@/lib/database";
import Character from "@/lib/model";

export const dynamic = "force-dynamic";

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
      <img src={stats[stat]} width={40} height={20} />
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

export default async function Home({ searchParams }) {
  const { page: searchPage, name } = await searchParams;

  const page = parseInt(searchPage) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const searchQuery = name || "";

  await connectToDatabase();

  const query = searchQuery
    ? { name: { $regex: searchQuery, $options: "i" } }
    : {};

  const characters = await Character.find(query).skip(skip).limit(limit);

  const totalCharacters = await Character.countDocuments(query);
  const totalPages = Math.ceil(totalCharacters / limit);


  return (
    <div className="w-full">
      <h1 className="text-center mt-10 font-bold text-4xl">{`Playmaker's Hidden potential`}</h1>

      <div className="max-w-5xl w-full mx-auto rounded bg-gray-600 p-10 md:p-20">
        <form className="mx-auto w-fit flex gap-2" method="get" action="/">
          <input
            className="rounded border p-1 text-black"
            type="text"
            name="name"
            placeholder="Search by name"
            defaultValue={searchQuery}
          />
          <button className="bg-green-600 p-2 rounded font-bold" type="submit">
            Search
          </button>
        </form>

        {/* Mostrar resultados */}

        <div className="flex flex-col w-fit mx-auto mt-10 gap-5">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className={`flex flex-col md:flex-row md:gap-5 max-w-xl ${index > 0 ? "border-t border-t-gray-500/90" : ""}`}
            >
              <div className="relative h-44 w-44 md:flex-1/2 mx-auto md:mx-0">
                <img
                  className="absolute top-0 left-0 scale-[.80] w-full"
                  src={getbase(character.category)}
                />
                <img
                  className="absolute -top-[3.5px] left-0 w-full"
                  src={getIcon(character.id)}
                />
              </div>
              <div className="flex flex-col gap-3 py-4 flex-1 items-center md:justify-start">
                <span className="text-xl text-center">{character.name}</span>
                <div className="flex items-center gap-2">
                  {character.hidden?.add > 0 && (
                    <HiddenStat stat="add" value={character.hidden.add} />
                  )}
                  {character.hidden?.crit > 0 && (
                    <HiddenStat stat="crit" value={character.hidden.crit} />
                  )}
                  {character.hidden?.eva > 0 && (
                    <HiddenStat stat="eva" value={character.hidden.eva} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Message />

      {/* <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i}
            href={`/?page=${i + 1}&name=${searchQuery}`} // Incluir la búsqueda en los enlaces de paginación
          >
            {i + 1}
          </a>
        ))}
      </div> */}
    </div>
  );
}
