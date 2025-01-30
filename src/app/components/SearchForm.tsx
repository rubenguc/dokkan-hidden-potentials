"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORY, CLASS, RARITY } from "@/contants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams();

    const name = formData.get("name") as string;
    const characterClass = formData.get("class") as string;
    const category = formData.get("category") as string;
    const rarity = formData.get("rarity") as string;

    if (name) params.set("name", name);
    if (characterClass && characterClass !== "ALL") params.set("class", characterClass);
    if (category && category !== "ALL") params.set("category", category);
    if (rarity && rarity !== "ALL") params.set("rarity", rarity);

    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      action={(formData) => handleSearch(formData)}
      className="mx-auto w-fit flex flex-col gap-4 items-center"
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-3">
        <div>
          <Label>Class</Label>
          <Select
            name="class"
            defaultValue={searchParams.get("class") || "ALL"}
            onValueChange={() => {
              document.forms[0].requestSubmit();
            }}
          >
            <SelectTrigger className="min-w-48">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              {Object.keys(CLASS).map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select
            name="category"
            defaultValue={searchParams.get("category") || "ALL"}
            onValueChange={() => {
              document.forms[0].requestSubmit();
            }}
          >
            <SelectTrigger className="min-w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              {Object.keys(CATEGORY).map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rarity</Label>
          <Select
            name="rarity"
            defaultValue={searchParams.get("rarity") || "ALL"}
            onValueChange={() => {
              document.forms[0].requestSubmit();
            }}
          >
            <SelectTrigger className="min-w-48">
              <SelectValue placeholder="Select rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              {Object.keys(RARITY).map((rarityName) => (
                <SelectItem key={rarityName} value={rarityName}>
                  {rarityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          name="name"
          placeholder="Search by name"
          defaultValue={searchParams.get("name") || ""}
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
