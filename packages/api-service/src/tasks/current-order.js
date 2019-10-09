/* eslint-disable camelcase */
export async function getCurrentOrder(festApi, series, edition) {
  const currentOrder = await festApi.getCurrentOrder(series, edition);

  if (!currentOrder) {
    throw new Error('Current order is empty, check if sessionid cookie is set');
  }

  return currentOrder;
}
