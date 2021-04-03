require("dotenv").config();
import { CronJob } from "cron"; 
import * as api from "./api";

import { BigNumber } from "bignumber.js";

function timestamp() {
  return Math.floor(Date.now()/1000);
}

const testRun = async () => {
  
  const init_start = 40;
  const duration = 40;
  const end_init = 60;
  const retry = 12;

  var last_time = 0;

  const initFunc = async () => {
    try {
      let startTime = timestamp() + init_start;
      last_time = startTime;
      console.log(">>>>>>>>Creating market...", new Date(timestamp()));
      await api.createMarket(1, startTime, duration);
    }
    catch(e) {
      console.log(e);
      setTimeout(initFunc, retry*1000);
    }
  }

  const startFunc = async (addr) => {
    try {
      console.log(">>>>>>>>Starting market...", new Date(timestamp()));
      await api.startMarket(addr);
    }
    catch(e) {
      console.log(e);
      setTimeout(() => {startFunc(addr)}, retry*1000);
    }
  }

  const endFunc = async (addr) => {
    try {
      console.log(">>>>>>>>Ending market...", new Date(timestamp()));
      api.endMarket(addr);
    }
    catch(e) {
      console.log(e);
      setTimeout(() => {endFunc(addr)}, retry*1000);
    }
  }
    
  api.onMarketCreated((res) => {
    console.log(">>>>>>>>Market is created: pair", res.marketPair, res.roundId, res.marketAddress);
    setTimeout(() => {startFunc(res.marketAddress)}, (last_time - timestamp() + 1) * 1000);
    setTimeout(() => {endFunc(res.marketAddress)}, (last_time - timestamp() + duration * 2 + 1) * 1000);
    //setTimeout(initFunc, (init_start + duration * 2 + end_init) * 1000);
  });

  initFunc();
}

const duration = 3600;
const pair_after = 70;
const retry = 16;
const onCreated = [[], []];

const playMarket = (pair) => {
  
  const startTime = Math.ceil(timestamp() / duration) * duration;
  const roundId = onCreated[pair].length;
  
  const initFunc = async () => {
    try {
      console.log(">>>>>>>>Creating market... ", pair, roundId, new Date(Date.now()));
      await api.createMarket(pair, startTime, duration);
    }
    catch(e) {
      console.log(e);
      setTimeout(initFunc, retry*1000);
    }
  }

  const startFunc = async (addr) => {
    try {
      console.log(">>>>>>>>Starting market...", pair, roundId, new Date(Date.now()));
      await api.startMarket(addr);
      console.log(">>>>>>>>Market is started: ", pair, roundId);
    }
    catch(e) {
      console.log(e);
      setTimeout(() => {startFunc(addr)}, retry*1000);
    }
  }

  const endFunc = async (addr) => {
    try {
      console.log(">>>>>>>>Ending market...", pair, roundId, new Date(Date.now()));
      await api.endMarket(addr);
      console.log(">>>>>>>>Market is ended: ", pair, roundId);
    }
    catch(e) {
      console.log(e);
      setTimeout(() => {endFunc(addr)}, retry*1000);
    }
  }
    
  onCreated[pair].push((res) => {
    console.log(">>>>>>>>Market is created: ", res.marketPair, res.roundId, res.marketAddress);
    setTimeout(() => {startFunc(res.marketAddress)}, (startTime - timestamp() + pair*pair_after + 1) * 1000);
    setTimeout(() => {endFunc(res.marketAddress)}, (startTime - timestamp() + duration * 2 + pair*pair_after + 1) * 1000);
  });

  initFunc();
}

const realRun = async () => {
  
  await api.clearMarket();
  console.log("Markets cleared");

  api.onMarketCreated((res) => {
    onCreated[Number(res.marketPair)][Number(res.roundId)](res);
  });

  const job = () => {
    setTimeout(job, duration * 1000);
    setTimeout(() => {playMarket(1)}, pair_after * 1000);
    playMarket(0);
  }

  var startTime = Math.ceil(timestamp() / duration) * duration - duration/2;
  if (timestamp() >= startTime)
    startTime += duration;
  setTimeout(job, (startTime - timestamp()) * 1000);
}

const run = async () => {

  console.log("My log: ", "Starting app...");

  realRun();
  //testRun();

};

export default {run};