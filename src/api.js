require("dotenv").config();

import Web3 from "web3";
import config from "./config";
import address from './address';
import market_abi from './abis/market.json';
import market_registry_abi from './abis/market-registry.json';
import price_feed_abi from './abis/price-feed.json';
import * as utils from './utils';

const web3 = new Web3(config.WEB3_PROVIDER_ADDRESS);
const market_registry = new web3.eth.Contract(market_registry_abi, address.market_registry.kovan);
const price_feed = new web3.eth.Contract(price_feed_abi, address.price_feed.kovan);

const sendTransaction = (target, privateKey, encodedABI) => {
  return new Promise((resolve, reject) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    var tx = {
      from: account.address,
      to: target,
      gas: 10000000,
      gasPrice: 30000000000,
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

export const createMarket = async (pair, startTime, duration) => {
  const result = await sendMethod(market_registry, "createMarket", pair, startTime, duration);
  return result;
}

export const startMarket = async (addr) => {
  const market = new web3.eth.Contract(market_abi, addr);
  const result = await sendMethod(market, "startMarket");
  return result;
}

export const endMarket = async (addr) => {
  const market = new web3.eth.Contract(market_abi, addr);
  const result = await sendMethod(market, "endMarket");
  return result;
}


export const getLastPrice = async() => {
  const lastPrice = await price_feed.methods.latestRoundData().call();
  return utils.fromEthPrice(lastPrice.answer);
}

export const clearMarket = async () => {
  const result = await sendMethod(market_registry, "clearMarket");
  return result;
}

export const onMarketCreated = (callback, onerr) => {
  market_registry.events.MarketCreated((err, res) => {
    if (err === null) {
      callback(res.returnValues);
    } else {
      if (onerr) onerr(err);
      else console.log(err);
    }
  })
}

// export const newRequest = (callback) => {
//   contract.events.OffChainRequest((error, result) => callback(error, result));
// };
