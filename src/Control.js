'use strict';

const _ = require('lodash');
const cron = require('cron');
const Promise = require('bluebird');

const {BU} = require('base-util-jh');

const Model = require('./Model');
const config = require('./config');

const moment = require('moment');


const DeviceController = require('../DeviceController');

class Control {
  /** @param {config=} config */
  constructor(config) {
    this.config = _.get(config, 'current', {});

    // 장치를 계측하기 위한 스케줄러 객체
    this.cronScheduler = null;

    /** @type {Array.<DeviceController>} */
    this.deviceControllerList = [];
    // 장치 계측이 완료되었는지 체크하기 위한 배열
    this.cronDeviceList = [];
  }

  /**
   * @param {string} comName 포트를 바꾸고자 할 경우
   */
  setDbConnectPort(comName) {
    this.config.deviceControllerList.forEach(element => {
      _.set(element, 'current.deviceInfo.connect_info.port', comName);
    });
    return true;
  }

  /**
   * 장치 컨트롤러 리스트 생성
   * @param {dbInfo=} dbInfo
   */
  async init(dbInfo) {
    if(dbInfo){
      this.config.dbInfo = dbInfo;
      const bmjh = require('base-model-jh');
      const BM = new bmjh.BM(dbInfo);

      let returnValue = [];
      let deviceList = await BM.getTable('inverter');
      deviceList.forEach(element => {
        element.protocol_info = JSON.parse(_.get(element, 'protocol_info'));
        element.connect_info = JSON.parse(_.get(element, 'connect_info'));
        element.logOption = {
          hasCommanderResponse: true,
          hasDcError: true,
          hasDcEvent: true,
          hasReceiveData: true,
          hasDcMessage: true,
          hasTransferCommand: true
        };
        element.controlInfo = {
          hasErrorHandling: true,
          hasOneAndOne: false,
          hasReconnect: true
        };
        // element.protocol_info = _.replace() _.get(element, 'protocol_info') ;
        let addObj = {
          hasDev: false,
          deviceInfo: element
        };
  
        returnValue.push({
          current: addObj
        });
      });

      this.config.deviceControllerList = returnValue;
    }

    // BU.CLI(this.config.deviceControllerList);
    this.model = new Model(this);
  }


  /**
   * 장치 설정 값에 따라 장치 계측 컨트롤러 생성 및 계측 스케줄러 실행
   * @returns {Promise} 장치 계측 컨트롤러 생성 결과 Promise
   */
  async createDeviceController() {
    // BU.CLI('createInverterController');
    this.config.deviceControllerList.forEach(deviceControllerInfo => {
      const deviceController = new DeviceController(deviceControllerInfo);
      deviceController.init();
      deviceController.attach(this);
      this.deviceControllerList.push(deviceController);
    });

    // 시스템 초기화 후 5초 후에 장치 계측 스케줄러 실행
    Promise.delay(1000 * 5)
      .then(() => {
        this.runCronMeasure();
      });
  }

  /**
   * 장치로부터 계측 명령을 완료했다고 알려옴
   * @param {Device} device 
   */
  notifyDeviceData(device){
    // BU.CLI('notifyDeviceData', device.id);
    // 알려온 Inverter 데이터가 
    _.remove(this.cronDeviceList, cronDevice => {
      if(_.isEqual(cronDevice, device)){
        // 장치 데이터 모델에 반영
        this.model.onDeviceData(device);
        return true;
      }
    });

    // 모든 장치의 계측이 완료되었다면 
    // BU.CLI(this.cronDeviceList.length);
    if(this.cronDeviceList.length === 0){
      this.model.updateDeviceCategory(this.measureDate, 'PCS');
    }

  }

  /**
   * 장치로부터 계측 명령을 완료했다고 알려옴
   * TODO 에러 처리 필요할 경우 기입
   * @param {Device} device 
   * @param {dcError} dcError 
   */
  notifyDeviceError(device, dcError) {

  }

  // Cron 구동시킬 시간
  runCronMeasure() {
    try {
      if (this.cronScheduler !== null) {
        // BU.CLI('Stop')
        this.cronScheduler.stop();
      }
      // 1분마다 요청
      this.cronScheduler = new cron.CronJob({
        cronTime: '0 */1 * * * *',
        onTick: () => {
          this.measureDate = moment();
          this.measureRegularDevice();
        },
        start: true,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  /** 정기적인 Inverter Status 탐색 */
  measureRegularDevice(){
    BU.CLI('measureRegularInverter');
    // 응답을 기다리는 장치 초기화
    this.cronDeviceList = _.clone(this.deviceControllerList);

    // Promise.map(this.deviceControllerList, inverter => {
    //   BU.CLI('@@@@@@@@@@@@@@@@@@@', this.deviceControllerList.length);
    //   BU.CLIN(inverter, 2);
    //   let commandInfoList = inverter.converter.generationCommand(inverter.baseModel.BASE.DEFAULT.COMMAND.STATUS);
    //   return inverter.orderOperation(commandInfoList);
    // });
    
    // 모든 장치에 계측 명령 요청
    this.deviceControllerList.forEach(deviceController => {
      let commandInfoList = deviceController.converter.generationCommand(deviceController.baseModel.BASE.DEFAULT.COMMAND.STATUS);
      deviceController.orderOperation(commandInfoList);
    });

  }





}
module.exports = Control;