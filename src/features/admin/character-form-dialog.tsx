"use client";

import { ORBS } from "@/constants";
import type { Character, CharacterForm } from "@/interfaces";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { useToggle } from "react-use";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { CharacterImage } from "../characters/components/character-image";
import {
  characterFormSchema,
  type CharacterFormSchema,
} from "../characters/validation/character-form-schema";

interface CharacterFormDialogProps {
  values?: Character;
  onFinish: () => void;
}

const DEFAULT_CHARACTER: CharacterForm = {
  hiddens: [
    {
      additional: 0,
      critical: 0,
      evasion: 0,
    },
  ],
  orbs: [],
  json: "",
};
export function CharacterFormDialog({
  values,
  onFinish,
}: CharacterFormDialogProps) {
  const [isLoading, toggleLoading] = useToggle(false);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CharacterFormSchema>({
    defaultValues: values
      ? {
          json: "",
          hiddens: values!.hiddens,
          orbs: values!.orbs,
        }
      : DEFAULT_CHARACTER,
    // @ts-ignore --- idk
    resolver: zodResolver(characterFormSchema),
  });

  const isCreation = !values?.id;

  const onSubmit = async (data: CharacterFormSchema) => {
    toggleLoading();
    try {
      let promise = null;

      if (isCreation) {
        promise = axios.post("/api/characters", data);
      } else {
        promise = axios.put("/api/characters", { ...data, id: values!.id });
      }

      await toast.promise(promise, {
        loading: isCreation ? "creando" : "modificando",
        success: isCreation ? "creado con exito" : "modificacion exitosa",
        error: "error del serivdor",
      });

      onFinish();
    } catch (_error) {
      toast.error("error");
    }
    toggleLoading();
  };

  const {
    fields: hiddenFields,
    append: appenHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddens",
  });

  const {
    fields: orbFields,
    append: appenOrb,
    update: updateOrb,
  } = useFieldArray({
    control,
    name: "orbs",
  });

  return (
    <>
      {!isCreation && (
        <div className="flex justify-center">
          <CharacterImage containerClassName="relative h-20 w-20" {...values} />
        </div>
      )}

      {/* @ts-ignore --- idk */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="json">Info</Label>
          <Textarea id="json" {...register("json")} className="max-h-20" />

          {errors.json && (
            <Badge variant="destructive">{errors.json?.message}</Badge>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <span className="capitalize">Hiddens</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() =>
              appenHidden({
                additional: 0,
                critical: 0,
                evasion: 0,
              })
            }
          >
            <Plus />
          </Button>
        </div>
        {errors.hiddens?.[0] && (
          <Badge variant="destructive">{errors.hiddens[0].message}</Badge>
        )}

        {hiddenFields.map((item, index) => (
          <div key={item.id} className="flex gap-2 items-end">
            <div className="flex gap-2">
              <div>
                <Label className="capitalize">Add</Label>
                <Input
                  type="number"
                  {...register(`hiddens.${index}.additional`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <Label className="capitalize">Crit</Label>
                <Input
                  type="number"
                  {...register(`hiddens.${index}.critical`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <Label className="capitalize">Eva</Label>
                <Input
                  type="number"
                  {...register(`hiddens.${index}.evasion`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeHidden(index)}
            >
              <Trash />
            </Button>
          </div>
        ))}

        <div className="flex gap-2 items-center">
          <span className="capitalize">Orbs</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() =>
              appenOrb({
                bronze: "",
                bronzeIsExclusive: false,
                silver: "",
                silverIsExclusive: false,
                gold: "",
                goldIsExclusive: false,
              })
            }
          >
            <Plus />
          </Button>
        </div>
        {errors.orbs?.[0] && (
          <Badge variant="destructive">
            {errors.orbs[0].bronze?.message ||
              errors.orbs[0].silver?.message ||
              errors.orbs[0].gold?.message}
          </Badge>
        )}

        {orbFields.map((item, index) => (
          <div key={item.id} className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex-1 flex gap-2 items-center">
                <div className="flex-1 w-full">
                  <Label className="capitalize">Bronze</Label>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={item.bronze}
                      onValueChange={(value) =>
                        updateOrb(index, {
                          ...item,
                          bronze: value,
                        })
                      }
                    >
                      <SelectTrigger className="max-w-24">
                        <SelectValue data-slot="select-orb" />
                        <SelectContent>
                          {ORBS.map((orb) => (
                            <SelectItem key={orb.id} value={orb.id}>
                              {orb.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                    <div className="flex space-x-2">
                      <Checkbox
                        id="bronze"
                        className={`border w-4 h-4 rounded border-white ${
                          item.bronzeIsExclusive && " bg-green-400"
                        }`}
                        checked={item.bronzeIsExclusive}
                        onCheckedChange={(checked) =>
                          updateOrb(index, {
                            ...item,
                            bronzeIsExclusive: checked as boolean,
                          })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="bronze"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Is exclusive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div>
                  <Label className="capitalize">Silver</Label>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={item.silver}
                      onValueChange={(value) =>
                        updateOrb(index, {
                          ...item,
                          silver: value,
                        })
                      }
                    >
                      <SelectTrigger className="max-w-24">
                        <SelectValue data-slot="select-orb" />
                        <SelectContent>
                          {ORBS.map((orb) => (
                            <SelectItem key={orb.id} value={orb.id}>
                              {orb.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                    <div className="flex space-x-2">
                      <Checkbox
                        id="silver"
                        className={`border w-4 h-4 rounded border-white ${
                          item.silverIsExclusive && " bg-green-400"
                        }`}
                        checked={item.silverIsExclusive}
                        onCheckedChange={(checked) =>
                          updateOrb(index, {
                            ...getValues(`orbs.${index}`),
                            silverIsExclusive: checked as boolean,
                          })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="silver"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Is exclusive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div>
                  <Label className="capitalize">Gold</Label>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={item.gold}
                      onValueChange={(value) =>
                        updateOrb(index, {
                          ...item,
                          gold: value,
                        })
                      }
                    >
                      <SelectTrigger className="max-w-24">
                        <SelectValue data-slot="select-orb" />
                        <SelectContent>
                          {ORBS.map((orb) => (
                            <SelectItem key={orb.id} value={orb.id}>
                              {orb.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                    <div className="flex space-x-2">
                      <Checkbox
                        id="gold"
                        className={`border w-4 h-4 rounded border-white ${
                          item.goldIsExclusive && " bg-green-400"
                        }`}
                        checked={item.goldIsExclusive}
                        onCheckedChange={(checked) =>
                          updateOrb(index, {
                            ...item,
                            goldIsExclusive: checked as boolean,
                          })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="gold"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Is exclusive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spint" />}
          Submit
        </Button>
      </form>
    </>
  );
}
