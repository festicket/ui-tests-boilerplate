export async function setProductBasket(festApi, festivalPk, itemPk) {
  const body = {
    basket_items: [{ quantity: 1, product_item: { pk: itemPk } }],
    basket_packages: [],
    festival_pk: festivalPk,
  };
  await festApi.setBasket(body);
}
