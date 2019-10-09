/* eslint-disable camelcase */
import config from '@ui-tests/config-service';
import { api, getJSON } from './api-methods';

const { apiInternalV1, apiInternalV2, internalAuthCookie } = config.application;

export class FesticketAPI {
  constructor() {
    this.FestAuthCookie = `X-FESTICKET-AUTH=${internalAuthCookie.value}`;

    // optional cookies that can bee set by setRequestCookies
    this.cookies = [this.FestAuthCookie];
  }

  getRequestOpts() {
    return {
      headers: {
        Cookie: this.cookies.join(';'),
      },
    };
  }

  async setRequestCookie(key, value) {
    this.cookies.push(`${key}=${value}`);
  }

  /**
   * Get product-groups for a festival from festicket api
   * @param {Array} festival
   */
  async getProductGroupsEndpoint(series, edition, groupType) {
    const url = `${apiInternalV2}/festivals/${series}/${edition}/product-groups/`;
    const { body } = await api('GET', url, this.getRequestOpts());
    const { package_groups, product_groups } = await getJSON(body, url);
    if (groupType === 'product') return product_groups;
    return package_groups;
  }

  async getProduct(product, series, edition) {
    const url = `${apiInternalV2}/festivals/${series}/${edition}/product/${product.pk}`;
    const { body } = await api('GET', url, this.getRequestOpts());
    return getJSON(body, url);
  }

  async getFestivals(page) {
    const url = `${apiInternalV1}/festivals/?page=${page}`;
    const { body } = await api('GET', url, this.getRequestOpts());
    return getJSON(body, url);
  }

  async getFeaturedFestivals() {
    const url = `${apiInternalV1}/festivals/?featured=1&page_size=20`;
    const { body } = await api('GET', url, this.getRequestOpts());
    return getJSON(body, url);
  }

  async getCurrentOrder(series, edition) {
    const url = `${apiInternalV1}/festivals/${series}/${edition}/current-order/`;
    const { body } = await api('GET', url, this.getRequestOpts());
    return getJSON(body, url);
  }

  async setBasket(body) {
    const url = `${apiInternalV2}/festivals/basket/`;

    await api('PUT', url, {
      ...this.getRequestOpts(),
      json: true,
      body,
    });
  }
}
