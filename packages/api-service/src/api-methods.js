import { promisify } from 'util';
import { put, get, post, patch } from 'request';

const promGet = promisify(get);
const promPut = promisify(put);
const promPost = promisify(post);
const promPatch = promisify(patch);
const jsonFormat = value => JSON.stringify(value, null, 2);

/**
 * API methods wrapper
 * @param {string} method
 * @param {string} endpoint
 * @param {Object} opts
 */
export async function api(method, endpoint, opts = null) {
  const result = { method, endpoint, error: false, message: null };
  let response = null;
  try {
    if (method === 'GET') {
      response = await promGet(endpoint, opts);
    } else if (method === 'POST') {
      response = await promPost(endpoint, opts);
    } else if (method === 'PUT') {
      response = await promPut(endpoint, opts);
    } else if (method === 'PATCH') {
      response = await promPatch(endpoint, opts);
    }
  } catch (error) {
    if (response && response.statusCode !== 200) {
      result.error = true;
      result.message = response.body;
    } else {
      result.error = true;
      result.message = error;
    }
    throw new Error(jsonFormat(result));
  }
  return response;
}

export function getJSON(body, url = '') {
  try {
    return JSON.parse(body);
  } catch (e) {
    const msg = `One of the API requests didn't return a valid JSON object. Check this url: ${url}
     The error returned was: ${e}`;
    // Handle and warn about API error instead of failing
    console.log(msg);
    return {};
  }
}
