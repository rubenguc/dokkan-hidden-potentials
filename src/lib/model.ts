import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  rarity: {
    type: String,
    enum: ["SSR", "UR", "LR"],
  },
  class: {
    type: String,
    enum: ["EXTREME", "SUPER"],
  },
  category: {
    type: String,
    enum: ["AGL", "TEQ", "INT", "STR", "PHY"],
  },
  hiddens: [
    {
      additional: {
        type: Number,
        default: 0,
      },
      critical: {
        type: Number,
        default: 0,
      },
      evasion: {
        type: Number,
        default: 0,
      },
    },
  ],
  orbs: [
    {
      bronze: {
        type: String,
        default: "",
      },
      bronzeIsExclusive: {
        type: Boolean,
        default: false,
      },
      silver: {
        type: String,
        default: "",
      },
      silverIsExclusive: {
        type: Boolean,
        default: false,
      },
      gold: {
        type: String,
        defaul: "",
      },
      goldIsExclusive: {
        type: Boolean,
        default: false,
      },
    },
  ],
  open_at: {
    type: Date,
    validate: {
      validator: (v) => v instanceof Date && !isNaN(v),
      message: "Fecha inválida",
    },
  },
  last_awakening: {
    type: Date,
    validate: {
      validator: (v) => v instanceof Date && !isNaN(v),
      message: "Fecha inválida",
    },
  },
  hasEZA: {
    type: Boolean,
    default: false,
  },
  hasSEZA: {
    type: Boolean,
    default: false,
  },
});

CharacterSchema.index({ last_awakening: 1 });
CharacterSchema.index({ last_awakening: -1 });
CharacterSchema.index({ rarity: 1 });
CharacterSchema.index({ class: 1 });
CharacterSchema.index({ category: 1 });
CharacterSchema.index({ id: 1 });
CharacterSchema.index({ id: -1 });

const Character =
  mongoose.models.Character || mongoose.model("Character", CharacterSchema);
export default Character;
