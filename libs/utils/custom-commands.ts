import config from '@ui-tests/config-service';
import allureReporter from '@wdio/allure-reporter';

export const customCommands = {
  clearCookiesAndSetAuthCookie: (
    isStaging: boolean,
    authCookie: WebdriverIO.Cookie,
  ) => {
    browser.url('');
    browser.deleteCookies();

    // When running outside of office network festicket app requires to authentication session with google creds
    // we bypass google auth with auth cookie only when using staging domain
    if (isStaging) {
      browser.setCookies(authCookie);
    }

    browser.url('');
  },

  setRequestCookies: (...cookies: string[]) => {
    const apiClient = browser.getApiClient();

    cookies.forEach(key => {
      const [cookie] = browser.getCookies([key]);
      if (!cookie) {
        throw new Error(`Festicket ${key} is missing!`);
      }
      apiClient.setRequestCookie(key, cookie.value);
    });
  },

  setSessionIdCookie: () => {
    browser.setRequestCookies('sessionid');
  },

  composeAppUrl(path = '') {
    const { baseUrl } = config.application;

    return `${baseUrl}${path}`;
  },

  waitForBecomeStale: (
    element: WebdriverIO.Element,
    timeout = 20000,
    error: string | undefined,
  ) => {
    const { elementId, selector } = element;
    browser.waitUntil(
      () => {
        const newElementId = $(selector).elementId;

        return elementId !== newElementId;
      },
      timeout,
      error,
    );
  },

  waitUntilUrlContains: (text: string) => {
    browser.waitUntil(() => {
      return browser.getUrl().includes(text);
    });
  },

  scrollTo: (element: WebdriverIO.Element) => {
    const { x, y } = element.getLocation();
    browser.execute(
      (xLoc, yLoc) => {
        scroll(xLoc, yLoc);
      },
      x,
      y,
    );
  },

  sendKeysWithDelay(element: WebdriverIO.Element, [...keys], delay: number) {
    if (keys.length === 0) {
      return;
    }
    element.setValue(keys[0]);
    browser.pause(delay);
    browser.sendKeysWithDelay(element, keys.splice(1, keys.length - 1), delay);
  },

  addAttachment(key: string, value: any) {
    const stringifiedValue =
      typeof value === 'object' ? JSON.stringify(value, null, 2) : value;

    allureReporter.addAttachment(key, stringifiedValue);
  },
};
