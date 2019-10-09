import config from '@ui-tests/config-service';

const { festivalBlacklist } = config.application;

/* eslint-disable camelcase */
/**
 * Return first item from product_groups
 * @param {Array} products
 * @param {Object} festival
 * @param {string} status
 * @param {string} productType
 */
export async function getFirstProductItemMatch(
  festApi,
  product,
  festival,
  status,
  productType,
) {
  const { items } = await festApi.getProduct(
    product,
    festival.series,
    festival.edition,
  );

  const firstMatch = items.find(item => {
    const itemStatusValue = item.status.toLowerCase();
    const itemTypeValue = item.type.toLowerCase();
    return itemStatusValue === status && itemTypeValue === productType;
  });

  return firstMatch
    ? {
        festivalPk: festival.pk,
        festivalName: festival.name,
        series: festival.series,
        edition: festival.edition,
        productPk: product.pk,
        productName: product.name,
        itemPk: firstMatch.pk,
        itemName: firstMatch.name,
        itemPrice: firstMatch.price,
        itemFee: firstMatch.fee,
      }
    : null;
}

/**
 * Get list of festivals from festicket API by status
 * Create an array of festivals filtered by status
 * @param {string} festivalStatus
 */
export async function getListOfFestivals(
  festApi,
  festivalStatus,
  { useFeatured = false, page = 1 },
) {
  const festivalObj = useFeatured
    ? await festApi.getFeaturedFestivals()
    : await festApi.getFestivals(page);

  if (!festivalObj.results) {
    console.log(
      `Warning: festApi.getFestivals returned ${JSON.stringify(
        festivalObj,
        null,
        2,
      )}`,
    );
  }

  return festivalObj.results
    .filter(festival => festival.status === festivalStatus)
    .filter(festival => !festivalBlacklist.includes(festival.series))
    .map(({ name, pk, series, edition }) => ({
      name,
      pk,
      series,
      edition,
    }));
}
