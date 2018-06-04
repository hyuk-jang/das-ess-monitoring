

const Control = require('./src/Control');

module.exports = Control;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const _ = require('lodash');
  const {BU} = require('base-util-jh');

  const config = require('./src/config');


  const control = new Control(config);

  control.init();


  let systemCmdInfo = control.converter.generationCommand(control.baseModel.BASE.DEFAULT.COMMAND.STATUS);
  BU.CLI(systemCmdInfo);

  setTimeout(() => {
    control.orderOperation(systemCmdInfo);
  }, 300);


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