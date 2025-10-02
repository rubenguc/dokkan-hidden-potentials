"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORY, CLASS, RARITY } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function Filters() {
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
      className="flex flex-wrap  gap-4 items-center py-4 px-2 mb-4 bg-[#082c09] border-green-400 border rounded-lg"
    >
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />

        <Input
          name="name"
          placeholder="Search by name"
          value={form.name}
          onChange={({ target: { value } }) => onFormChange("name", value)}
          className="pl-10 bg-secondary/30 border-border placeholder:text-slate-300"
        />
      </div>

      <Select
        name="class"
        value={form.class}
        onValueChange={(value) => onFormChange("class", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select class" className="" />
        </SelectTrigger>
        <SelectContent className="bg-[#082c09] border-green-400 text-white">
          <SelectItem value="ALL">All Classes</SelectItem>
          {Object.keys(CLASS).map((className) => (
            <SelectItem key={className} value={className}>
              {className}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        name="category"
        value={form.category}
        onValueChange={(value) => onFormChange("category", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-[#082c09] border-green-400 text-white">
          <SelectItem value="ALL">All Categories</SelectItem>
          {Object.keys(CATEGORY).map((categoryName) => (
            <SelectItem key={categoryName} value={categoryName}>
              {categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        name="rarity"
        value={form.rarity}
        onValueChange={(value) => onFormChange("rarity", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select rarity" />
        </SelectTrigger>
        <SelectContent className="bg-[#082c09] border-green-400 text-white">
          <SelectItem value="ALL">All Rarities</SelectItem>
          {Object.keys(RARITY).map((rarityName) => (
            <SelectItem key={rarityName} value={rarityName}>
              {rarityName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  );
}
