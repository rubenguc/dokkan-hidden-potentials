"use client";

import { ORBS } from "@/contants";
import { Character } from "@/interfaces";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CharacterCard from "@/components/shared/CharacterCard";
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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Badge } from "@/components/ui/badge";
import { useToggle } from "react-use";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";

interface CharacterFormProps {
  values?: Character;
  onFinish: () => void;
}

const DEFAULT_CHARACTER: Partial<Character> & { json: string } = {
  hiddens: [
    {
      mode: "",
      additional: 0,
      critical: 0,
      evasion: 0,
    },
  ],
  orbs: [],
  json: "",
};

const schema = yup.object().shape({
  hiddens: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          additional: yup.number().required(),
          critical: yup.number().required(),
          evasion: yup.number().required(),
        })
        .test(
          "al-menos-dos-campos-positivos",
          "Al menos dos campos (additional, critical, evasion) deben ser >= 0",
          function (value) {
            const camposPositivos = Object.values(value).filter(
              (v) => v > 0
            ).length;
            return camposPositivos >= 2;
          }
        )
    )
    .min(1, "Debe haber al menos un hidden"),
  orbs: yup.array().of(
    yup.object().shape({
      bronze: yup.string().required("Bronze es requerido"),
      silver: yup.string().required("Silver es requerido"),
      gold: yup.string().required("Gold es requerido"),
    })
  ),
  json: yup.string().optional(),
});

export default function CharacterForm({
  values,
  onFinish,
}: CharacterFormProps) {
  const [isLoading, toggleLoading] = useToggle(false);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Character>({
    defaultValues:
      Object.keys(values || {}).length > 0 ? values : DEFAULT_CHARACTER,
    resolver: yupResolver(schema),
  });

  const isCreation = !values?.id;

  const onSubmit = async (data: Character) => {
    toggleLoading();
    try {
      let promise = null;


      if (isCreation) {
        promise = axios.post("/api/characters", data);
      } else {
        promise = axios.put("/api/characters", data);
      }

      await toast.promise(promise as any, {
        loading: isCreation ? "creando" : "modificando",
        success: isCreation ? "creado con exito" : "modificacion exitosa",
        error: "error del serivdor",
      });

      onFinish();
    } catch (error) {
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
    remove: removeOrb,
    update: updateOrb,
  } = useFieldArray({
    control,
    name: "orbs",
  });


  return (
    <>
      {!isCreation && (
        <div className="flex justify-center">
          <CharacterCard
            containerClassName="relative h-32 w-32 mx-auto md:mx-0"
            {...values}
          />
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="json">Info</Label>
          <Textarea id="json" {...register("json")} />

          {errors.id && (
            <Badge variant="destructive">{errors.json.message}</Badge>
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
                mode: "",
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
                        <SelectValue />
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
                        className={`border w-4 h-4 rounded border-white ${item.bronzeIsExclusive && " bg-green-400"
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
                        <SelectValue />
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
                        className={`border w-4 h-4 rounded border-white ${item.silverIsExclusive && " bg-green-400"
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
                        <SelectValue />
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
                        className={`border w-4 h-4 rounded border-white ${item.goldIsExclusive && " bg-green-400"
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
