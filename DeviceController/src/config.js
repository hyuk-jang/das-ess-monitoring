'use strict';

require('./define.js');

/** @type {{current: {hasDev: boolean, deviceInfo: deviceInfo}}} */
module.exports = {
  current: {
    hasDev: true, // 장치 연결을 실제로 하는지 여부
    deviceInfo: {
      target_id: 'IVT_001',
      target_name: '인버터 계측 프로그램',
      target_category: 'inverter',
      logOption: {
        hasCommanderResponse: true,
        hasDcError: true,
        hasDcEvent: true,
        hasReceiveData: true,
        hasDcMessage: true,
        hasTransferCommand: true
      },
      controlInfo: {
        hasErrorHandling: true,
        hasOneAndOne: false,
        hasReconnect: true
      },
      protocol_info: {
        mainCategory: 'ess',
        subCategory: 'das_pv_led',
        deviceId: '000',
        protocolOptionInfo: {
          hasTrackingData: true
        },
        option: {
          isUseKw: false
        }
      },
      // connect_info: {
      //   type: 'serial',
      //   baudRate: 19200,
      //   port: 'COM8'
      // },
      connect_info: {
        type: 'socket',
        port: 9000,

      },
    }
  }
};