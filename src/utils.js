import BigNumber from "bignumber.js"

export const toEthPrice = (val) => {
  return BigNumber(val).shiftedBy(8);
}

export const fromEthPrice = (val) => {
  return BigNumber(val).shiftedBy(-8).toNumber();
}
