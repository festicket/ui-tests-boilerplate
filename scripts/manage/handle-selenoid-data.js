const fetch = require('node-fetch');

const {
  BRANCH_NAME,
  UPDATE,
  FIELD,
  VALUE,
  SEMAPHORE_AUTH_TOKEN,
  SEMAPHORE_STORE_VAR_ID,
  SEMAPHORE_STORE_VAR_ID_DEV,
} = process.env;

const ID = BRANCH_NAME.includes('selenoid-branch')
  ? SEMAPHORE_STORE_VAR_ID
  : SEMAPHORE_STORE_VAR_ID_DEV;
const endpoint = `https://api.semaphoreci.com/v2/env_vars/${ID}?auth_token=${SEMAPHORE_AUTH_TOKEN}`;

const handleData = async () => {
  const response = await fetch(endpoint);
  const json = await response.json();
  const currentData = JSON.parse(json.content);

  if (UPDATE) {
    const newData = { ...currentData };
    newData[BRANCH_NAME][FIELD] = VALUE;

    await fetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ content: JSON.stringify(newData) }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(newData);
  } else {
    console.log(currentData[BRANCH_NAME][FIELD]);
  }
};

handleData();
