"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastPrice = exports.endMarket = exports.initMarket = exports.startMarket = exports.clearMarket = exports.sendMethod = undefined;

var _web = require("web3");

var _web2 = _interopRequireDefault(_web);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _address = require("./address");

var _address2 = _interopRequireDefault(_address);

var _market = require("./abis/market.json");

var _market2 = _interopRequireDefault(_market);

var _priceFeed = require("./abis/price-feed.json");

var _priceFeed2 = _interopRequireDefault(_priceFeed);

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

const web3 = new _web2.default(_config2.default.WEB3_PROVIDER_ADDRESS);
const market = new web3.eth.Contract(_market2.default, _address2.default.market.kovan);
const price_feed = new web3.eth.Contract(_priceFeed2.default, _address2.default.price_feed.kovan);

const sendTransaction = (target, privateKey, encodedABI) => {
  return new Promise((resolve, reject) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    var tx = {
      from: account.address,
      to: target,
      gas: 1000000,
      data: encodedABI
    };
    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
    signPromise.then(signedTx => {
      const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      sentTx.on("receipt", receipt => {
        resolve(receipt);
      });
      sentTx.on("error", err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
};

const sendMethod = exports.sendMethod = (contract, method, ...params) => {
  return new Promise((resolve, reject) => {
    const privateKey = process.env.PRIVATE_KEY;
    var encodedABI = contract.methods[method](...params).encodeABI();
    sendTransaction(contract._address, privateKey, encodedABI).then(resolve).catch(reject);
  });
};

const clearMarket = exports.clearMarket = async () => {
  await sendMethod(market, "clearMarket");
};

const startMarket = exports.startMarket = async () => {
  const result = await sendMethod(market, "startMarket");
  return result;
};

const initMarket = exports.initMarket = async (startTime, duration, range) => {
  await sendMethod(market, "initiate", startTime, duration, utils.toEthPrice(range), _address2.default.market_registry.kovan);
};

const endMarket = exports.endMarket = async () => {
  await sendMethod(market, "endMarket");
};

const getLastPrice = exports.getLastPrice = async () => {
  const lastPrice = await price_feed.methods.latestRoundData().call();
  return utils.fromEthPrice(lastPrice.answer);
};

// export const newRequest = (callback) => {
//   contract.events.OffChainRequest((error, result) => callback(error, result));
// };