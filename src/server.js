require("dotenv").config();
import { CronJob } from "cron"; 
import * as api from "./api";

import { BigNumber } from "bignumber.js";

const run = async () => {

  console.log("My log: ", "Starting app...");

  // api.getLastPrice()
  //   .then(price => {
  //     console.log(price);
  //   })
  //   .catch(console.log);


  // let date = new Date();
  // date.setSeconds(date.getSeconds() + 10);
  // let minute = date.getMinutes();
  // let second = date.getSeconds();
  // var initJob = new CronJob(second + ' ' + minute + '/9 * * * *', async () => {
    
  // });
  // var startJob = new CronJob(second + ' ' + ((minute+1)%60) + '/9 * * * *', () => {
   
  //   startFunc();
  // });
  // var endJob = new CronJob(second + ' ' + ((minute+7)%60) + '/9 * * * *', () => {
  //   const endFunc = async () => {
  //     try {
  //       console.log(">>>>>>>>Ending market...");
  //       api.endMarket();
  //     }
  //     catch(e) {
  //       console.log(e);
  //       setTimeout(endFunc, 12000);
  //     }
  //   }
  //   endFunc();
  // });

  const init_start = 60;
  const start_predict = 180;
  const end_init = 60;
  const retry = 12;

  const initFunc = async () => {
    try {
      console.log(">>>>>>>>Clearing market...", Math.floor(Date.now()/1000));
      await api.clearMarket();
      let startTime = Math.floor(Date.now()/1000) + init_start;
      console.log(">>>>>>>>Initializing market...", Math.floor(Date.now()/1000));
      await api.initMarket(startTime, start_predict, 5);
      setTimeout(startFunc, init_start*1000);
    }
    catch(e) {
      console.log(e);
      setTimeout(initFunc, retry*1000);
    }
  }

  const startFunc = async () => {
    try {
      console.log(">>>>>>>>Starting market...", Math.floor(Date.now()/1000));
      await api.startMarket();
      setTimeout(endFunc, start_predict*2*1000);
    }
    catch(e) {
      console.log(e);
      setTimeout(startFunc, retry*1000);
    }
  }

  const endFunc = async () => {
    try {
      console.log(">>>>>>>>Ending market...", Math.floor(Date.now()/1000));
      api.endMarket();
      setTimeout(initFunc, end_init*1000);
    }
    catch(e) {
      console.log(e);
      setTimeout(endFunc, retry*1000);
    }
  }
  
  initFunc();


  // let m = 1;
  // setInterval(() => {
  //   console.log(m++);
  // }, 1000);

  // const mainfunc = async () => {
  //   try {
  //     let startTime = Math.floor(Date.now()/1000) + 30;
  //     setTimeout(async () => {
  //       console.log(">>>>>>>>>>Starting market...");
  //       let res = await api.startMarket();
  //       console.log(">>>>>>>>>>Done.");
  //     }, 32000);
  //     setTimeout(async () => {
  //       console.log(">>>>>>>>>>Ending market...");
  //       await api.endMarket();
  //       console.log(">>>>>>>>>>Done.");
  //     }, 332000);
  //     console.log(">>>>>>>>>>Clearing market...");
  //     await api.clearMarket();
  //     console.log(">>>>>>>>>>Initializing market...");
  //     await api.initMarket(startTime, 150, 5);
  //     console.log(">>>>>>>>>>Done.");
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }

  // setInterval(mainfunc, 360000);
  // mainfunc();

  
  // console.log(">>>>>>>>>>Ending market...");
  // await api.endMarket();
  // console.log(">>>>>>>>>>Done.");

};

export default {run};