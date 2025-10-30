export const getCardImage = async (cardId: number) => {
  const response = await fetch(
    `https://dokkaninfo.com/assets/global/en/character/thumb/card_${cardId}_thumb/card_${cardId}_thumb.png`,
  );

  return await response.arrayBuffer().then(Buffer.from);
};
