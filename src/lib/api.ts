// import { CardInfo } from "@/interfaces";
// import axios from "axios";

// export const URL = "https://dokkan.wiki/api";

// export const http = axios.create({
//   baseURL: URL,
// });

// export const getCardInfo = async (id: string): Promise<CardInfo> => {
//   const { data } = await http.get(`/cards/${id}`);
//   return data as CardInfo;
// };

export const getCardImage = async (cardId: number) => {
  const response = await fetch(
    `https://dokkan.wiki/assets/global/en/character/thumb/card_${cardId}_thumb.png`
  );

  return await response.arrayBuffer().then(Buffer.from);
};
