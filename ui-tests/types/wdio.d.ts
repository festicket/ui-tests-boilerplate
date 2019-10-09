declare module WebdriverIO {
  // adding command to `browser`
  interface Browser {
    getApiClient: () => any;
    setRequestCookies: (...cokies: string[]) => void;
    setSessionIdCookie: () => void;
    clearCookiesAndSetAuthCookie: (
      isStaging: boolean,
      authCookie: WebdriverIO.Cookie,
    ) => void;
    composeAppUrl: (path: string) => string;
    waitForBecomeStale: (
      element: WebdriverIO.Element,
      timeout?: number | undefined,
      error?: string | undefined,
    ) => void;
    waitUntilUrlContains: (text: string) => void;
    scrollTo: (element: WebdriverIO.Element) => void;
    sendKeysWithDelay: (
      element: WebdriverIO.Element,
      [...keys]: string[],
      delay: number,
    ) => void;
    addAttachment: (key: string, value: any) => void;
  }
}

declare module UiTests {
  type SearchType =
    | 'festival'
    | 'artist'
    | 'genre'
    | 'venue'
    | 'activity'
    | 'country';

  interface FestivalSearchData {
    searchText: string;
    series: string;
    edition: string;
  }

  interface SearchData {
    searchText: string;
    slug: string;
  }
}
