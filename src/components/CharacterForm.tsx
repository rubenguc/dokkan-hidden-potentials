"use client";

import { CATEGORY, CLASS, RARITY } from "@/contants";
import { Character } from "@/interfaces";
import { Button, Field, Input, Label, Select } from "@headlessui/react";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsTrashFill } from "react-icons/bs";
import { MdAddCircle } from "react-icons/md";
import CharacterCard from "./CharacterCard";

interface CharacterFormProps {
  values?: Character;
}

const DEFAULT_CHARACTER: Character = {
  id: "0",
  name: "",
  title: "",
  category: CATEGORY.AGL,
  class: CLASS.SUPER,
  rarity: RARITY.UR,
  hiddens: [
    {
      offensive: false,
      defensive: false,
      support: false,
      additional: 0,
      critical: 0,
      evasion: 0,
    },
  ],
};

export default function CharacterForm({ values }: CharacterFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Character>({
    defaultValues: Object.keys(values || {}).length > 0 ? values : DEFAULT_CHARACTER,
  });

  const isCreation = !values?.id

  const onSubmit = async (data: Character) => {

    try {
      console.log("subiendo:", data)

      let promise = null;

      if (isCreation) {
        promise = axios.post("/api/characters", data)
      } else {
        promise = axios.put("/api/characters", data)
      }


      toast.promise(promise as any, {
        loading: isCreation ? 'creando' : "modificando",
        success: isCreation ? 'creado con exito' : "modificacion exitosa",
        error: "error del serivdor"
      })

    } catch (error) {
      console.log("error: ", error)
      toast.error("error")
    }

  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hiddens",
  });

  return (
    <>
      {
        !isCreation && (
          <div className="flex justify-center">
            <CharacterCard containerClassName="relative h-32 w-32 mx-auto md:mx-0" {...values} />
          </div>
        )
      }

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label className="capitalize">ID</Label>
          <Input
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("id")}
          />
        </Field>
        <Field>
          <Label className="capitalize">name</Label>
          <Input
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("name")}
          />
        </Field>
        <Field>
          <Label className="capitalize">title</Label>
          <Input
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("title")}
          />
        </Field>
        <Field>
          <Label className="capitalize">class</Label>
          <Select
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("class")}
          >
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
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("category")}
          >
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
            className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
            {...register("rarity")}
          >
            {Object.keys(RARITY).map((rarityName) => (
              <option key={rarityName} value={rarityName}>
                {rarityName}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex gap-2 items-center">
          <span className="capitalize">Hiddens</span>
          <Button
            type="button"
            onClick={() =>
              append({
                additional: 0,
                critical: 0,
                evasion: 0,
                offensive: false,
                defensive: false,
                support: false,
              })
            }
          >
            <MdAddCircle />
          </Button>
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2">
              <span>Aditional {index + 1}</span>
              <Button type="button" onClick={() => remove(index)}>
                <BsTrashFill />
              </Button>
            </div>

            <div className="flex gap-2">
              <Field className="flex items-center gap-1">
                <Input
                  type="checkbox"
                  {...register(`hiddens.${index}.offensive`)}
                />
                <Label className="text-sm/6 font-medium text-white">
                  Offensive
                </Label>
              </Field>
              <Field className="flex items-center gap-1">
                <Input
                  type="checkbox"
                  {...register(`hiddens.${index}.defensive`)}
                />
                <Label className="text-sm/6 font-medium text-white">
                  Defensive
                </Label>
              </Field>
              <Field className="flex items-center gap-1">
                <Input
                  type="checkbox"
                  {...register(`hiddens.${index}.support`)}
                />
                <Label className="text-sm/6 font-medium text-white">
                  Support
                </Label>
              </Field>
            </div>

            <div className="flex gap-2">
              <Field>
                <Label className="capitalize">Add</Label>
                <Input
                  className="py-3 px-4 block w-20 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
                  type="number"
                  {...register(`hiddens.${index}.additional`, {
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Field>
                <Label className="capitalize">Crit</Label>
                <Input
                  className="py-3 px-4 block w-20 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
                  type="number"
                  {...register(`hiddens.${index}.critical`, {
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Field>
                <Label className="capitalize">Eva</Label>
                <Input
                  className="py-3 px-4 block w-20 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 border border-neutral-500"
                  type="number"
                  {...register(`hiddens.${index}.evasion`, {
                    valueAsNumber: true,
                  })}
                />
              </Field>
            </div>

          </div>
        ))}

        <Button className="border" type="submit">Submit</Button>
      </form>
    </>
  );
}
