import fs from 'fs';

export function saveEnvironmentAllure(config) {
  const dir = 'allure-results';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const { selenium, selenoid, application } = config;

  const data = Object.entries({
    ...selenium,
    ...selenoid,
    baseUrl: application.baseUrl,
  }).reduce((accumulator, entry) => {
    const [key, value] = entry;
    const stringifiedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;
    return `${accumulator}${key}=${stringifiedValue}\n`;
  }, '');

  fs.writeFileSync(`${dir}/environment.properties`, data);
}

export const getRandomInt = max => Math.floor(Math.random() * max);

export const getRandomItemFromArray = array =>
  array[getRandomInt(array.length)];

export const shuffleArray = array => {
  const tmpArray = array;
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tmpArray[i], tmpArray[j]] = [tmpArray[j], tmpArray[i]];
  }
  return tmpArray;
};

export const mergeArrays = (...arrays) => {
  const result: any[] = [];
  arrays.forEach(array => {
    if (!array) return;

    result.push(...array);
  });
  return result;
};

// produces an object with unique keys as array values and sets values for all keys as true
export const arrayToObject = array =>
  array.reduce((obj, cur) => ({ ...obj, [cur]: true }), {});

export const getRandomItemsFromArray = (array, quantity) =>
  shuffleArray(array).slice(-quantity);

export const getCountryCodeFromUrl = url => url.slice(-3).replace('/', '');

export const getObjectFromMultipleArrays = (...arrays) => {
  const mergedArray = mergeArrays(...arrays);
  const objectFromArray = arrayToObject(mergedArray);
  return objectFromArray;
};
