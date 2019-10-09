import { getFirstProductItemMatch, getListOfFestivals } from './tasks/general';
import { getFirstProductMatch } from './tasks/product-groups';
import { getCurrentOrder } from './tasks/current-order';
import { setProductBasket } from './tasks/basket';
import { FesticketAPI } from './fest-api';

export class ApiService {
  constructor() {
    this.festApi = new FesticketAPI();
  }

  async setRequestCookie(key, value) {
    this.festApi.setRequestCookie(key, value);
  }

  async getFirstProductItemMatch(product, festival, status, productType) {
    return getFirstProductItemMatch(
      this.festApi,
      product,
      festival,
      status,
      productType,
    );
  }

  async getListOfFestivals(festivalStatus, options) {
    return getListOfFestivals(this.festApi, festivalStatus, options);
  }

  async getFirstProductMatch(festival, productStatus, productType, groupType) {
    return getFirstProductMatch(
      this.festApi,
      festival,
      productStatus,
      productType,
      groupType,
    );
  }

  async getCurrentOrder(series, edition) {
    return getCurrentOrder(this.festApi, series, edition);
  }

  async setProductBasket(festivalPk, itemPk) {
    await setProductBasket(this.festApi, festivalPk, itemPk);
  }
}
