/* eslint-disable camelcase */

import { getApiLogger } from '@ui-tests/logger';

const apiLogger = getApiLogger('PRODUCT-GROUPS');

/**
 * Get list of products from package or product groups from festicket API by festival
 * Create an array of products filtered by status
 * @param {Array} festival
 * @param {string} type
 */
async function getProducts(festApi, festival, { productType } = {}, groupType) {
  const productGroups = await festApi.getProductGroupsEndpoint(
    festival.series,
    festival.edition,
    groupType,
  );

  apiLogger(`getProducts: ${festival.series} ${festival.edition} ${groupType}`);

  // Workaround for issue with wrong response from API
  if (!productGroups) return [];

  if (groupType === 'product') {
    const productGroup = productGroups.filter(prodGroup => {
      const baseType = prodGroup.base_type.toLowerCase();
      const subType = prodGroup.subtype ? prodGroup.subtype.toLowerCase() : '';
      if (subType) return baseType === productType && subType === productType;
      return baseType === productType;
    });
    apiLogger(productGroup);

    return productGroup;
  }

  // return array of filtered package_groups
  const packageGroup = productGroups.filter(prodGroup => {
    const subType = prodGroup.subtype.toLowerCase();
    return subType === productType;
  });
  apiLogger(packageGroup);

  return packageGroup;
}

/**
 * Return the first product of a festival that matches given criteria.
 * @param {Array} festival
 * @param {string} productStatus
 * @param {string} productType
 */
export async function getFirstProductMatch(
  festApi,
  festival,
  productStatus,
  productType,
  groupType,
) {
  // get array of products for the festivals
  const products = await getProducts(
    festApi,
    festival,
    {
      productType,
    },
    groupType,
  );

  // Make a flat array of products & find the first match for the filters.
  if (groupType === 'product') {
    return (
      products
        .reduce((acc, cur) => acc.concat(cur.products), [])
        .find(product => {
          // Get availability value and create a filter for product_groups
          const prodStatus = product.availability.value.toLowerCase();
          return product.type === productType && prodStatus === productStatus;
        }) || null
    );
  }
  // Make a flat array of packages & find the first match for the filters.
  return (
    products
      .reduce((acc, cur) => acc.concat(cur), [])
      .find(product => product) || null
  );
}
