import z from "zod";

const hiddenSchema = z
  .object({
    additional: z.number(),
    critical: z.number(),
    evasion: z.number(),
  })
  // Validación personalizada: al menos dos de los tres campos deben ser mayores a 0
  .refine(
    (hidden) => {
      const count = [hidden.additional, hidden.critical, hidden.evasion].filter(
        (value) => value > 0,
      ).length;
      return count >= 2;
    },
    {
      message:
        "Al menos dos de los campos (additional, critical, evasion) deben ser mayores a 0",
    },
  );

const orbSchema = z.object({
  bronze: z.string(),
  bronzeIsExclusive: z.boolean(),
  silver: z.string(),
  silverIsExclusive: z.boolean(),
  gold: z.string(),
  goldIsExclusive: z.boolean(),
});

export const characterFormSchema = z
  .object({
    json: z.string(),
    hiddens: z
      .array(hiddenSchema)
      .min(1, { message: "Debe contener al menos un elemento en hiddens" }),
    orbs: z
      .array(orbSchema)
      .optional()
      .transform((val) => val ?? []),
  })
  .transform((data) => ({
    ...data,
    orbs: data.orbs ?? [],
  }));

export type CharacterFormSchema = z.infer<typeof characterFormSchema>;
