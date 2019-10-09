export const removeCurrency = (priceText: string) =>
  priceText.replace(/^\D+/, '');
