
const Converter = require('../../../module/device-protocol-converter-jh');
let keyInfo = Converter.BaseModel.ESS.BASE_KEY;

/**
 * @typedef {Object} tableParamFormat
 * @property {string} fromKey
 * @property {string} toKey
 */

module.exports = [{
  deviceCategory: 'PCS',
  troubleTableInfo: {
  },
  dataTableInfo: {
    tableName: 'inverter_data',
    /** @type {Array.<tableParamFormat>} */
    addParamList: [{
      fromKey: 'inverter_seq',
      toKey: 'inverter_seq',
    }],
    insertDateKey: 'writedate',
    matchingList: [{
      fromKey: keyInfo.pvAmp,
      toKey: 'in_a',
      // calculate: 1,
      // toFixed: 0
    }, {
      fromKey: keyInfo.pvVol,
      toKey: 'in_v',
      // calculate: 10,
      // toFixed: 0
    }, {
      fromKey: keyInfo.pvKw,
      toKey: 'in_kw',
      calculate: 1,
      toFixed: 3
    }, {
      fromKey: keyInfo.gridRAmp,
      toKey: 'out_a',
      // calculate: 10,
      // toFixed: 0
    }, {
      fromKey: keyInfo.gridRsVol,
      toKey: 'out_v',
      // calculate: 10,
      // toFixed: 0
    }, {
      fromKey: keyInfo.powerGridKw,
      toKey: 'out_kw',
      calculate: 1,
      toFixed: 3
    },
    // {
    //   fromKey: keyInfo.powerDailyKwh,
    //   toKey: 'd_wh',
    //   calculate: 10000,
    //   toFixed: 0
    // },
    {
      fromKey: keyInfo.powerTotalKwh,
      toKey: 'c_kwh',
      calculate: 1,
      toFixed: 3
    },
    {
      fromKey: keyInfo.operIsError,
      toKey: 'operation_has_v',
    }, {
      fromKey: keyInfo.operMode,
      toKey: 'operation_mode',
    }, {
      fromKey: keyInfo.operStatus,
      toKey: 'operation_status',
    },{
      fromKey: keyInfo.batteryVol,
      toKey: 'battery_v',
      // calculate: 10,
      // toFixed: 0
    },{
      fromKey: keyInfo.batteryAmp,
      toKey: 'battery_a',
      // calculate: 10,
      // toFixed: 0
    },{
      fromKey: keyInfo.batteryChargingKw,
      toKey: 'battery_charging_kw',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.batteryDischargingKw,
      toKey: 'battery_discharging_kw',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.batteryTotalChargingKw,
      toKey: 'battery_total_charging_kwh',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.batteryTotalDischargingKw,
      toKey: 'battery_total_discharging_kwh',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.ledDcVol,
      toKey: 'led_dc_v',
      // calculate: 10,
      // toFixed: 0
    },{
      fromKey: keyInfo.ledDcAmp,
      toKey: 'led_dc_a',
      // calculate: 10,
      // toFixed: 0
    },{
      fromKey: keyInfo.ledUsingKw,
      toKey: 'led_using_kw',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.ledTotalUsingKwh,
      toKey: 'led_total_using_kwh',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.inputLineKw,
      toKey: 'input_line_kw',
      calculate: 1,
      toFixed: 3
    },{
      fromKey: keyInfo.inputLineTotalKwh,
      toKey: 'input_total_line_kwh',
      calculate: 1,
      toFixed: 3
    }
    ]
  }
}];