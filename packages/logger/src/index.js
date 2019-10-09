import debug from 'debug';

const getLogger = area => title => {
  const logger = debug(area);

  return (...content) => {
    logger(`[${title}]`, ...content);
  };
};

export const getSpecsLogger = getLogger('specs');
export const getApiLogger = getLogger('api');
export const getConfigLogger = getLogger('config');
