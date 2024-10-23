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
  rarity: {
    type: String,
    enum: ["UR", "LR"],
  },
  class: {
    type: String,
    enum: ["EXTREME", "SUPER"],
  },
  category: {
    type: String,
    enum: ["AGL", "TEQ", "INT", "STR", "PHY"],
  },
  hidden: {
    add: {
      type: Number,
      default: 0, // Valor por defecto si no se especifica
    },
    crit: {
      type: Number,
      default: 0, // Valor por defecto si no se especifica
    },
    eva: {
      type: Number,
      default: 0, // Valor por defecto si no se especifica
    },
  },
});

const Character =
  mongoose.models.Character || mongoose.model("Character", CharacterSchema);
export default Character;
