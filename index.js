

const Control = require('./src/Control');

module.exports = Control;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');


  const _ = require('lodash');
  const {BU} = require('base-util-jh');

  const config = require('./src/config');


  const control = new Control(config);

  // control.setDbConnectPort('COM18');

  BU.CLI(control.config.deviceControllerList);

  // control
  control.init();
  // control.init({
  //   host: process.env.INVERTER_HOST ? process.env.INVERTER_HOST : 'localhost',
  //   user: process.env.INVERTER_USER ? process.env.INVERTER_USER : 'root',
  //   password: process.env.INVERTER_PW ? process.env.INVERTER_PW : 'reaper83',
  //   database: process.env.INVERTER_DB ? process.env.INVERTER_DB : 'pv_led'
  // })
  //   .then(() => {
  //     control.setDbConnectPort('COM8');
  control.createDeviceController();
  //   });

  // setTimeout(() => {
  //   control.measureDate = new Date();
  //   control.measureRegularInverter();
  // }, 2000);

  // setInterval(() => {
  //   control.measureDate = new Date();
  //   control.measureRegularInverter();
  // }, 1000 * 60);




  process.on('uncaughtException', function (err) {
    // BU.debugConsole();
    console.error(err.stack);
    console.log(err.message);
    console.log('Node NOT Exiting...');
  });
  
  
  process.on('unhandledRejection', function (err) {
    // BU.debugConsole();
    console.error(err.stack);
    console.log(err.message);
    console.log('Node NOT Exiting...');
  });
}