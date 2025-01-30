import { CATEGORY, CLASS } from "@/contants";
import { Character as ICharacter } from "@/interfaces";
import { getCardImage, getCardInfo } from "@/lib/api";
import { connectToDatabase } from "@/lib/database";
import { getClassAndCategory, getRarity, RARITY } from "@/lib/hidden-utils";
import Character from "@/lib/model";
import { uploadImage } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0") + 1;
  const limit = parseInt(searchParams.get("limit") || "10");
  const nameFilter = searchParams.get("name") || "";

  const query = {};

  if (nameFilter) {
    query.name = new RegExp(nameFilter, "i");
  }

  try {
    const characters = await Character.find(query)
      .sort({ last_awakening: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCharacters = await Character.countDocuments(query);
    const totalPages = Math.ceil(totalCharacters / limit);

    return NextResponse.json({
      characters,
      currentPage: page,
      totalPages,
      totalCharacters,
    });
  } catch (error) {
    // console.log({ error });
    return NextResponse.json(
      { message: "Error fetching characters" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id, hiddens, orbs } = await req.json();

    const character = await getCardInfo(id);

    const lastAwaken =
      character.optimal_awakening_growths?.pop?.()?.open_at ||
      character.card.open_at;

    const { class: cclass, category } = getClassAndCategory(
      character.card.element
    );

    const hasEZA = !!character?.optimal_awakening_growths?.[0];
    const hasSEZA = !!character?.optimal_awakening_growths?.[1];

    const body: ICharacter = {
      id,
      title: character.card.title,
      name: character.card.name,
      open_at: character.card.open_at,
      last_awakening: lastAwaken,
      hiddens,
      class: cclass as CLASS,
      category: category as CATEGORY,
      rarity: getRarity(character.card.rarity),
      hasEZA,
      hasSEZA,
      orbs,
    };

    const cardId = body.rarity === "SSR" ? id : Number(id) - 1;

    const image = await getCardImage(cardId);

    await uploadImage({
      file: image,
      fileName: body.id + ".webp",
    });

    const newCharacter = new Character(body);

    await newCharacter.save();

    return NextResponse.json(newCharacter, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const result = await Character.findOneAndUpdate(
      {
        id: body.id,
      },
      {
        $set: body,
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "not found" }, { status: 500 });
    }

    return NextResponse.json(
      {},
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ message: "Error post" }, { status: 500 });
  }
}
