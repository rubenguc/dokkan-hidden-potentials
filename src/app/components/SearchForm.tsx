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
import { useEffect, useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: searchParams.get("name") || "",
    class: searchParams.get("class") || "ALL",
    category: searchParams.get("category") || "ALL",
    rarity: searchParams.get("rarity") || "ALL",
  });

  const onFormChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (form.name) params.set("name", form.name);
    if (form.class && form.class !== "ALL") params.set("class", form.class);
    if (form.category && form.category !== "ALL")
      params.set("category", form.category);
    if (form.rarity && form.rarity !== "ALL") params.set("rarity", form.rarity);

    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.class, form.category, form.rarity]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="mx-auto w-fit flex flex-col gap-4 items-center"
    >
      <div className="flex flex-col md:flex-row flex-wrap gap-3">
        <div>
          <Label>Class</Label>
          <Select
            name="class"
            value={form.class}
            onValueChange={(value) => onFormChange("class", value)}
          >
            <SelectTrigger className="min-w-32 bg-[#4a4f4a]/70">
              <SelectValue placeholder="Select class" className="" />
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
            value={form.category}
            onValueChange={(value) => onFormChange("category", value)}
          >
            <SelectTrigger className="min-w-32 bg-[#4a4f4a]/70">
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
            value={form.rarity}
            onValueChange={(value) => onFormChange("rarity", value)}
          >
            <SelectTrigger className="min-w-32 bg-[#4a4f4a]/70">
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
          value={form.name}
          onChange={({ target: { value } }) => onFormChange("name", value)}
          className="bg-[#4a4f4a]/70"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </form>
  );
}
