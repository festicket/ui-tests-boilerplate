import config from '@ui-tests/config-service';
import reportportal from 'wdio-reportportal-reporter';
import RpService from 'wdio-reportportal-service';
import TestStatsReporter from './libs/utils/testStatsReporter';
import { saveEnvironmentAllure } from './libs/utils/general-helpers';

/**
 * ██████╗  █████╗ ███████╗██╗ ██████╗
 * ██╔══██╗██╔══██╗██╔════╝██║██╔════╝
 * ██████╔╝███████║███████╗██║██║
 * ██╔══██╗██╔══██║╚════██║██║██║
 * ██████╔╝██║  ██║███████║██║╚██████╗
 * ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝
 */

const { server } = config.selenium;
const { baseUrl, isStaging, internalAuthCookie } = config.application;
const services: any[] = ['selenium-standalone'];
const reporters: any[] = [
  'spec',
  TestStatsReporter,
  [
    'allure',
    {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    },
  ],
];
saveEnvironmentAllure(config);

/**
 *  ██████╗ █████╗ ██████╗  █████╗ ██████╗ ██╗██╗     ██╗████████╗██╗███████╗███████╗
 * ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║██║     ██║╚══██╔══╝██║██╔════╝██╔════╝
 * ██║     ███████║██████╔╝███████║██████╔╝██║██║     ██║   ██║   ██║█████╗  ███████╗
 * ██║     ██╔══██║██╔═══╝ ██╔══██║██╔══██╗██║██║     ██║   ██║   ██║██╔══╝  ╚════██║
 * ╚██████╗██║  ██║██║     ██║  ██║██████╔╝██║███████╗██║   ██║   ██║███████╗███████║
 *  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝
 */

const { isHeadless, browserName, platformName } = config.selenium;
const {
  isSelenoid,
  enableVideo,
  enableLog,
  enableVNC,
  videoCodec,
} = config.selenoid;

let caps = {
  browserName,
  // maxInstances can get overwritten per capability. So if you have an in-house Selenium
  // grid with only 5 firefox instances available you can make sure that not more than
  // 5 instances get started at a time.
  maxInstances: 1,
  platformName,
};

if (browserName === 'chrome' && isHeadless) {
  caps = Object.assign({}, caps, {
    chromeOptions: { args: ['--headless', '--disable-gpu'] },
  });
}

if (isSelenoid) {
  caps = Object.assign({}, caps, {
    enableLog,
    enableVNC,
    enableVideo,
    videoCodec,
    browserVersion: '74',
  });
  // Overwrite platformName in case of Selenoid
  caps.platformName = 'LINUX';

  // Remove selenium-standalone service
  services.filter(service => service !== 'selenium-standalone');
}
const capabilities = [caps];

/**
 * ███████╗██╗   ██╗██╗████████╗███████╗███████╗
 * ██╔════╝██║   ██║██║╚══██╔══╝██╔════╝██╔════╝
 * ███████╗██║   ██║██║   ██║   █████╗  ███████╗
 * ╚════██║██║   ██║██║   ██║   ██╔══╝  ╚════██║
 * ███████║╚██████╔╝██║   ██║   ███████╗███████║
 * ╚══════╝ ╚═════╝ ╚═╝   ╚═╝   ╚══════╝╚══════╝
 */

const onlyProd = [];

const onlyStage = [];

const allEnv = [...onlyProd, ...onlyStage];

const suites = isStaging ? { suite: allEnv } : { suite: onlyProd };

/**
 * ██████╗ ███████╗██████╗  ██████╗ ██████╗ ████████╗██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗
 * ██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║
 * ██████╔╝█████╗  ██████╔╝██║   ██║██████╔╝   ██║   ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║
 * ██╔══██╗██╔══╝  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║
 * ██║  ██║███████╗██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
 * ╚═╝  ╚═╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
 */

const { reportPortal } = config;

if (reportPortal.isEnabled) {
  const reportPortalConfig = {
    reportPortalClientConfig: {
      token: reportPortal.uuid,
      endpoint: reportPortal.endpoint,
      launch: 'execution',
      project: 'selenium',
      mode: 'DEFAULT',
      debug: false,
      description: 'Launch description text',
      tags: ['tags', 'for', 'launch'],
    },
    reportSeleniumCommands: false,
    autoAttachScreenshots: false,
    seleniumCommandsLogLevel: 'debug',
    screenshotsLogLevel: 'info',
    parseTagsFromTestTitle: true,
  };

  services.push([RpService, {}]);
  reporters.push([reportportal, reportPortalConfig]);
}

/**
 * ██╗    ██╗██████╗ ██╗ ██████╗  ██████╗ ██████╗ ███╗   ██╗███████╗██████╗  █████╗ ████████╗ █████╗
 * ██║    ██║██╔══██╗██║██╔═══██╗██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
 * ██║ █╗ ██║██║  ██║██║██║   ██║██║     ██║   ██║██╔██╗ ██║█████╗  ██║  ██║███████║   ██║   ███████║
 * ██║███╗██║██║  ██║██║██║   ██║██║     ██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══██║   ██║   ██╔══██║
 * ╚███╔███╔╝██████╔╝██║╚██████╔╝╚██████╗╚██████╔╝██║ ╚████║██║     ██████╔╝██║  ██║   ██║   ██║  ██║
 *  ╚══╝╚══╝ ╚═════╝ ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
 */
export default {
  baseUrl,
  capabilities,
  internalAuthCookie,
  isStaging,
  server,
  services,
  suites,
  reporters,
};
