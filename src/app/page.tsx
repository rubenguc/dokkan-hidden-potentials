import { Footer } from "@/features/home/components/home-footer";
import { Header } from "@/features/home/components/home-header";
import { useGetCharacters } from "@/features/characters/hooks/useGetCharacters";
import type { SearchParams } from "@/interfaces";
import { CharacterCard } from "@/features/characters/components/character-card";
import { Filters } from "@/features/home/components/home-filters";
import { Pagination } from "@/features/home/components/home-pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { characters, totalPages } = await useGetCharacters(params);

  return (
    <div className="min-h-screen grid-bg">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Filters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
        <Pagination totalPages={totalPages} page={Number(params.page || 1)} />
      </div>
      <Footer />
    </div>
  );
}
