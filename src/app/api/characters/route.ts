import { connectToDatabase } from "@/lib/database";
import Character from "@/lib/model";
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

    const body = await req.json();

    const character = new Character(body);

    await character.save();

    return NextResponse.json(character, {
      status: 201,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ message: "Error post" }, { status: 500 });
  }
}
