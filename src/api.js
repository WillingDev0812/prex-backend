require("dotenv").config();

import Web3 from "web3";
import config from "./config";
import address from './address';
import market_abi from './abis/market.json';
import price_feed_abi from './abis/price-feed.json';
import * as utils from './utils';

const web3 = new Web3(config.WEB3_PROVIDER_ADDRESS);
const market = new web3.eth.Contract(market_abi, address.market.kovan);
const price_feed = new web3.eth.Contract(price_feed_abi, address.price_feed.kovan);

const sendTransaction = (target, privateKey, encodedABI) => {
  return new Promise((resolve, reject) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    var tx = {
      from: account.address,
      to: target,
      gas: 1000000,
      data: encodedABI,
    };
    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
    signPromise.then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      sentTx.on("receipt", receipt => {
        resolve(receipt);
      });
      sentTx.on("error", err => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

export const sendMethod = (contract, method, ...params) => {
  return new Promise((resolve, reject) => {
    const privateKey = process.env.PRIVATE_KEY;
    var encodedABI = contract.methods[method](...params).encodeABI();
    sendTransaction(contract._address, privateKey, encodedABI)
      .then(resolve)
      .catch(reject)
  }); 
};

export const clearMarket = async () => {
  await sendMethod(market, "clearMarket");
}

export const startMarket = async () => {
  const result = await sendMethod(market, "startMarket");
  return result;
}

export const initMarket = async (startTime, duration, range) => {
  await sendMethod(market, "initiate", startTime, duration, utils.toEthPrice(range), address.market_registry.kovan);
}

export const endMarket = async () => {
  await sendMethod(market, "endMarket");
}

export const getLastPrice = async() => {
  const lastPrice = await price_feed.methods.latestRoundData().call();
  return utils.fromEthPrice(lastPrice.answer);
}

// export const newRequest = (callback) => {
//   contract.events.OffChainRequest((error, result) => callback(error, result));
// };
