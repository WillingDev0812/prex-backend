"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromEthPrice = exports.toEthPrice = undefined;

var _bignumber = require("bignumber.js");

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toEthPrice = exports.toEthPrice = val => {
  return (0, _bignumber2.default)(val).shiftedBy(8);
};

const fromEthPrice = exports.fromEthPrice = val => {
  return (0, _bignumber2.default)(val).shiftedBy(-8).toNumber();
};