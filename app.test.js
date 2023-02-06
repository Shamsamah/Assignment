const axios = require('axios');
const assert = require('assert');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false
});

let transactionID;
let coin1Amount;
let coin2Amount;

describe('/transaction endpoint tests', () => {
  it('makes a POST request to the /transaction endpoint', async () => {
    const apiBaseURL = 'https://x8ki-letl-twmt.n7.xano.io/api:gHPd8le5';
    const endpoint = '/transaction';
    coin1Amount = Math.floor(Math.random() * 1000);
    coin2Amount = Math.floor(Math.random() * 1000);
    try {
      const response = await axios.post(`${apiBaseURL}${endpoint}`, {
        "coin1": "INR",
        "coin2": "USDT",
        "coin1Amount": coin1Amount,
        "coin2Amount": coin2Amount
      }, { httpsAgent: agent, timeout: 5000 });

      assert.equal(response.status, 200);
      assert.equal(response.data.sentCoin, 'INR');
      assert.equal(response.data.receivedCoin, 'USDT');
      assert.equal(response.data.sentCoinAmount, coin1Amount);
      assert.equal(response.data.receivedCoinAmount, coin2Amount);

      transactionID = response.data.id;

    } catch (error) {
      console.error(error);
    }
  });

  it('makes a GET request to the /transaction/{id} endpoint', async () => {
    const apiBaseURL = 'https://x8ki-letl-twmt.n7.xano.io/api:gHPd8le5';
    const endpoint = `/transaction/${transactionID}`;
    // const coin1Amount = '${coin1Amount}'
    // const coin2Amount = '${coin2Amount}'

    try {
      const response = await axios.get(`${apiBaseURL}${endpoint}`, { httpsAgent: agent, timeout: 5000 });

      assert.equal(response.status, 200);
      assert.equal(response.data.sentCoin, 'INR');
      assert.equal(response.data.receivedCoin, 'USDT');
      assert.equal(response.data.sentCoinAmount, `${coin1Amount}`);
      assert.equal(response.data.receivedCoinAmount, `${coin2Amount}`);
      assert.equal(response.data.receivedCoinMarketPrice, response.data.sentCoinAmount / response.data.receivedCoinAmount);

    } catch (error) {
      console.error(error);
    }
  });
});
