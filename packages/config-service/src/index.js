import envalid, { bool, str, url, num } from 'envalid';
import DEFAULTS from './defaults.json';

const parseEnvVariables = () =>
  envalid.cleanEnv(process.env, {
    SITE: str({ default: DEFAULTS.SITE }), // TODO: improve validation!
    STAGING_DOMAIN: str({ default: DEFAULTS.STAGING_DOMAIN }),
    PROD_DOMAIN: str({ default: DEFAULTS.PROD_DOMAIN }),
    INTERNAL_AUTH_COOKIE_NAME: str({
      default: DEFAULTS.INTERNAL_AUTH_COOKIE_NAME,
    }),
    INTERNAL_AUTH_COOKIE_VALUE: str({
      default: DEFAULTS.INTERNAL_AUTH_COOKIE_VALUE,
    }),
    API_INTERNAL_V1_SUFFIX: str({ default: DEFAULTS.API_INTERNAL_V1_SUFFIX }),
    API_INTERNAL_V2_SUFFIX: str({ default: DEFAULTS.API_INTERNAL_V2_SUFFIX }),
    IS_LOCAL: bool({ default: DEFAULTS.IS_LOCAL }),
    LOCAL_SERVER_HOST: str({ default: DEFAULTS.LOCAL_SERVER_HOST }),
    LOCAL_SERVER_PORT: num({ default: DEFAULTS.LOCAL_SERVER_PORT }),
    REMOTE_SERVER_HOST: str({ default: DEFAULTS.REMOTE_SERVER_HOST }),
    REMOTE_SERVER_PORT: num({ default: DEFAULTS.REMOTE_SERVER_PORT }),
    HEADLESS_BROWSER: bool({ default: DEFAULTS.HEADLESS_BROWSER }),
    ENABLE_SNAPSHOTS: bool({ default: DEFAULTS.ENABLE_SNAPSHOTS }),
    BROWSER_NAME: str({ default: DEFAULTS.BROWSER_NAME }),
    PLATFORM_NAME: str({ default: DEFAULTS.PLATFORM_NAME }),
    IS_SELENOID: bool({ default: DEFAULTS.IS_SELENOID }),
    SELENOID_ENABLE_VIDEO: bool({ default: DEFAULTS.SELENOID_ENABLE_VIDEO }),
    SELENOID_ENABLE_LOG: bool({ default: DEFAULTS.SELENOID_ENABLE_LOG }),
    SELENOID_ENABLE_VNC: bool({ default: DEFAULTS.SELENOID_ENABLE_VNC }),
    SELENOID_VIDEO_CODEC: str({ default: DEFAULTS.SELENOID_VIDEO_CODEC }),
    TIMEOUT: num({ default: DEFAULTS.TIMEOUT }),
    CONDITIONAL_TIMEOUT: num({ default: DEFAULTS.CONDITIONAL_TIMEOUT }),
    MAX_PAGES_FESTIVALS_API_V1: num({
      default: DEFAULTS.MAX_PAGES_FESTIVALS_API_V1,
    }),
    EXISTING_USER_EMAIL: str({ default: DEFAULTS.EXISTING_USER_EMAIL }),
    EXISTING_USER_PWD: str({ default: DEFAULTS.EXISTING_USER_PWD }),
    NEGATIVE_TEST_PWD: str({ default: DEFAULTS.NEGATIVE_TEST_PWD }),
    FESTIVAL_BLACKLIST: str({ default: '' }),
    RP_ENABLE: bool({ default: DEFAULTS.RP_ENABLE }),
    RP_ENDPOINT: url({ default: DEFAULTS.RP_ENDPOINT }),
    RP_USERNAME: str({ default: DEFAULTS.RP_USERNAME }),
    RP_PASSWORD: str({ default: DEFAULTS.RP_PASSWORD }),
    RP_USERUUID: str({ default: DEFAULTS.RP_USERUUID }),
  });

const isNullString = string => string === 'null';
const validateVariable = (variable, message) => {
  if (isNullString(variable)) {
    throw new Error(message);
  }
};

const buildConfig = envObj => {
  const site = envObj.SITE;
  const isStaging = site !== 'prod';
  const baseUrl = isStaging
    ? `https://${site}.${envObj.STAGING_DOMAIN}/`
    : `https://${envObj.PROD_DOMAIN}/`;
  const isLocal = envObj.IS_LOCAL;

  if (!isLocal) {
    validateVariable(
      envObj.INTERNAL_AUTH_COOKIE_VALUE,
      '\nINTERNAL_AUTH_COOKIE_VALUE is required!\n',
    );
  }

  if (isNullString(envObj.INTERNAL_AUTH_COOKIE_VALUE)) {
    console.log('\nWarning: INTERNAL_AUTH_COOKIE_VALUE has not been set!\n');
  }

  if (isNullString(envObj.EXISTING_USER_PWD)) {
    console.log(
      '\nWarning: EXISTING_USER_PWD has not been set! Login test might not work.\n',
    );
  }

  if (envObj.RP_ENABLE) {
    console.log(
      'Reportportal is enabled! Make sure to set correct endpoint in RP_ENDPOINT.',
    );
    if (isNullString(envObj.RP_USERUUID)) {
      console.log('\nWarning: RP_USERUUID is required!\n');
    }
    if (isNullString(envObj.RP_USERNAME)) {
      console.log('\nWarning: RP_USERNAME is required!\n');
    }
    if (isNullString(envObj.RP_PASSWORD)) {
      console.log('\nWarning: RP_PASSWORD is required!\n');
    }
  }

  return {
    selenium: {
      isLocal,
      server: isLocal
        ? { host: envObj.LOCAL_SERVER_HOST, port: envObj.LOCAL_SERVER_PORT }
        : { host: envObj.REMOTE_SERVER_HOST, port: envObj.REMOTE_SERVER_PORT },
      isHeadless: envObj.HEADLESS_BROWSER,
      enableSnapshots: envObj.ENABLE_SNAPSHOTS,
      browserName: envObj.BROWSER_NAME.toLowerCase(),
      browserVersion: envObj.BROWSER_VERSION,
      platformName: envObj.PLATFORM_NAME,
    },
    selenoid: {
      isSelenoid: envObj.IS_SELENOID,
      enableVideo: envObj.SELENOID_ENABLE_VIDEO,
      enableLog: envObj.SELENOID_ENABLE_LOG,
      enableVNC: envObj.SELENOID_ENABLE_VNC,
      videoCodec: envObj.SELENOID_VIDEO_CODEC,
    },
    application: {
      baseUrl,
      isStaging,
      internalAuthCookie: {
        name: envObj.INTERNAL_AUTH_COOKIE_NAME,
        value: envObj.INTERNAL_AUTH_COOKIE_VALUE,
      },
      apiInternalV1: `${baseUrl}${envObj.API_INTERNAL_V1_SUFFIX}`,
      apiInternalV2: `${baseUrl}${envObj.API_INTERNAL_V2_SUFFIX}`,
      timeout: envObj.TIMEOUT,
      conditionalTimeout: envObj.CONDITIONAL_TIMEOUT,
      apiInternalV1Values: {
        maxPagesFestivals: envObj.MAX_PAGES_FESTIVALS_API_V1,
      },
      loginData: {
        existingUserEmail: envObj.EXISTING_USER_EMAIL,
        existingUserPWD: envObj.EXISTING_USER_PWD,
        negativeTestPWD: envObj.NEGATIVE_TEST_PWD,
      },
      festivalBlacklist: envObj.FESTIVAL_BLACKLIST.split(';'),
    },
    reportPortal: {
      isEnabled: envObj.RP_ENABLE,
      endpoint: envObj.RP_ENDPOINT,
      uuid: envObj.RP_USERUUID,
    },
  };
};

const env = parseEnvVariables();
const config = buildConfig(env);

export default config;
