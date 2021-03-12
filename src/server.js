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
  //   try {
  //     let startTime = Date.now() + 55;
  //     console.log(">>>>>>>>Clearing market...");
  //     await api.clearMarket();
  //     console.log(">>>>>>>>Initializing market...");
  //     await api.initMarket(startTime);
  //   }
  //   catch(e) {
  //     console.log(e);
  //   }
  // });
  // var startJob = new CronJob(second + ' ' + ((minute+1)%60) + '/9 * * * *', async () => {
  //   try {
  //     console.log(">>>>>>>>Starting market...");
  //     await api.startMarket();
  //   }
  //   catch(e) {
  //     console.log(e);
  //   }
  // });
  // var endJob = new CronJob(second + ' ' + ((minute+7)%60) + '/9 * * * *', async () => {
  //   try {
  //     console.log(">>>>>>>>Ending market...");
  //     api.endMarket();
  //   }
  //   catch(e) {
  //     console.log(e);
  //   }
  // });
  // initJob.start();
  // startJob.start();
  // endJob.start();
  // var m = 0;
  // setInterval(() => {
  //   console.log(m);
  //   m++;
  // }, 1000);

  
  let m = 1;
  setInterval(() => {
    console.log(m++);
  }, 1000);

  const mainfunc = async () => {
    try {
      let startTime = Math.floor(Date.now()/1000) + 30;
      setTimeout(async () => {
        console.log(">>>>>>>>>>Starting market...");
        let res = await api.startMarket();
        console.log(">>>>>>>>>>Done.");
      }, 32000);
      setTimeout(async () => {
        console.log(">>>>>>>>>>Ending market...");
        await api.endMarket();
        console.log(">>>>>>>>>>Done.");
      }, 332000);
      console.log(">>>>>>>>>>Clearing market...");
      await api.clearMarket();
      console.log(">>>>>>>>>>Initializing market...");
      await api.initMarket(startTime, 150, 5);
      console.log(">>>>>>>>>>Done.");
    }
    catch (e) {
      console.log(e);
    }
  }

  setInterval(mainfunc, 360000);
  mainfunc();

  
  // console.log(">>>>>>>>>>Ending market...");
  // await api.endMarket();
  // console.log(">>>>>>>>>>Done.");

};

export default {run};