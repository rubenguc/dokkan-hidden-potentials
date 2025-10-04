export const getCardImage = async (cardId: number) => {
  const response = await fetch(
    `https://dokkan.wiki/assets/global/en/character/thumb/card_${cardId}_thumb.png`,
  );

  return await response.arrayBuffer().then(Buffer.from);
};
