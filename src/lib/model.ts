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
  hiddens: [
    {
      offensive: {
        type: Boolean,
        default: false,
      },
      defensive: {
        type: Boolean,
        default: false,
      },
      support: {
        type: Boolean,
        default: false,
      },
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
});

CharacterSchema.index({ rarity: 1 });
CharacterSchema.index({ class: 1 });
CharacterSchema.index({ category: 1 });
CharacterSchema.index({ id: 1 }); // ASC
CharacterSchema.index({ id: -1 }); // DESC

const Character =
  mongoose.models.Character || mongoose.model("Character", CharacterSchema);
export default Character;
