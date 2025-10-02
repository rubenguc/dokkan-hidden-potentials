"use server";

import { Character } from "@/features/characters/schema/character-schema";
import { connectToDatabase } from "@/features/db/db";
import { SearchParams } from "@/interfaces";

export async function useGetCharacters({
  page = 1,
  name,
  rarity,
  class: characterClass,
  category,
}: SearchParams) {
  const limit = 15;
  const _page = parseInt(page) || 1;
  const skip = (_page - 1) * limit;

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
