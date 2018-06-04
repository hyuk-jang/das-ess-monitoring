'use strict';

const _ = require('lodash');
const { BU } = require('base-util-jh');

const AbstDeviceClient = require('device-client-controller-jh');
// const AbstDeviceClient = require('../../../device-client-controller-jh');

const Model = require('./Model');

let config = require('./config');

const { AbstConverter, BaseModel } = require('device-protocol-converter-jh');
// const { AbstConverter, BaseModel } = require('../../../device-protocol-converter-jh');
// const {AbstConverter} = require('device-protocol-converter-jh');

class Control extends AbstDeviceClient {
  /** @param {config} config */
  constructor(config) {
    super();

    this.config = _.get(config, 'current', {});


    this.converter = new AbstConverter(this.config.deviceInfo.protocol_info);
    this.baseModel = new BaseModel.ESS(this.config.deviceInfo.protocol_info);

    this.model = new Model(this);

    this.observerList = [];
  }

  get id() {
    return this.config.deviceInfo.target_id;
  }

  /** device client 설정 및 프로토콜 바인딩 */
  init() {
    /** 개발 버젼일 경우 Echo Server 구동 */
    if (this.config.hasDev) {
      const EchoServer = require('device-echo-server-jh');
      const echoServer = new EchoServer(this.config.deviceInfo.connect_info.port);
      echoServer.attachDevice(this.config.deviceInfo.protocol_info);
    }
    this.setDeviceClient(this.config.deviceInfo);
    this.converter.setProtocolConverter(this.config.deviceInfo);
  }

  /**
   * 
   * @param {Object} parent 
   */
  attach(parent) {
    this.observerList.push(parent);
  }

  /**
   * 장치의 현재 데이터 및 에러 내역을 가져옴
   */
  getDeviceOperationInfo() {
    return {
      id: this.config.deviceInfo.target_id,
      config: this.config.deviceInfo,
      data: this.model.deviceData,
      // systemErrorList: [{code: 'new Code2222', msg: '에러 테스트 메시지22', occur_date: new Date() }],
      systemErrorList: this.systemErrorList,
      troubleList: this.model.deviceData.operTroubleList,
      measureDate: new Date()
    };
  }


  /**
   * 
   * @param {commandInfo[]} commandInfoList 
   */
  orderOperation(commandInfoList) {
    BU.CLI(commandInfoList);
    try {
      let commandSet = this.generationManualCommand({
        cmdList: commandInfoList,
        commandId: this.id,
      });

      // BU.CLIN(commandSet);

      this.executeCommand(commandSet);
    } catch (error) {
      this.observerList.forEach(observer => {
        if(_.get(observer, 'notifyDeviceData')){
          observer.notifyDeviceData(this);
        }
      });
      BU.CLI(error.message);
    }
  }


  /**
   * Device Controller 변화가 생겨 관련된 전체 Commander에게 뿌리는 Event
   * @param {dcEvent} dcEvent 
   */
  updatedDcEventOnDevice(dcEvent) {
    BU.CLI('updateDcEvent\t', dcEvent.eventName);
    try {
      switch (dcEvent.eventName) {
      case this.definedControlEvent.CONNECT:
        break;
      default:
        break;
      }

    } catch (error) {

      BU.CLI(error.message);
    }
  }

  /**
   * 장치에서 명령을 수행하는 과정에서 생기는 1:1 이벤트
   * @param {dcError} dcError 현재 장비에서 실행되고 있는 명령 객체
   */
  onDcError(dcError) {
    BU.CLI(this.id, dcError.errorInfo);

    this.converter.resetTrackingDataBuffer();
    try {
      switch (_.get(dcError, 'errorInfo.message')) {
      case this.definedControlEvent.DISCONNECT:
        BU.CLI(this.definedControlEvent.DISCONNECT);
        // 명령 수행 중 에러가 발생하였을 경우 상위 객체에 현재 수행중인 명령이 완료되었다고 알려줌
        _.forEach(this.observerList, observer => {
          if(_.get(observer, 'notifyDeviceData')){
            observer.notifyDeviceData(this);
          }
        });
        break;
      default:
      // 선택지 1: 에러가 발생할 경우 해당 명령 무시하고 다음 명령 수행
        this.requestTakeAction(this.definedCommanderResponse.NEXT);
        break;
      }

      // 명령 수행 중 에러가 발생하였을 경우 상위 객체에 알려줌
      _.forEach(this.observerList, observer => {
        if(_.get(observer, 'notifyDeviceError')){
          observer.notifyDeviceError(this, dcError);
        }
      });


      // 에러가 발생하면 해당 명령을 모두 제거
      // return this.deleteCommandSet(dcError.commandSet.commandId);
    } catch (error) {
      BU.errorLog('onDcError', _.get(error, 'message'), error);
    }
  }

  /**
   * 메시지 발생 핸들러
   * @param {dcMessage} dcMessage 
   */
  onDcMessage(dcMessage) {
    // BU.CLI(dcMessage.msgCode);
    switch (dcMessage.msgCode) {
    // 계측이 완료되면 Observer에게 알림
    case this.definedCommandSetMessage.COMMANDSET_EXECUTION_TERMINATE:
      this.observerList.forEach(observer => {
        if(_.get(observer, 'notifyDeviceData')){
          observer.notifyDeviceData(this);
        }
      });
      // this.emit('done', this.getDeviceOperationInfo());
      break;
    default:
      break;
    }

  }


  /**
   * 장치로부터 데이터 수신
   * @interface
   * @param {dcData} dcData 현재 장비에서 실행되고 있는 명령 객체
   */
  onDcData(dcData) {
    try {
      BU.CLI('data', dcData.data.toString());
      const parsedData = this.converter.parsingUpdateData(dcData);

      // 만약 파싱 에러가 발생한다면 명령 재 요청
      if (parsedData.eventCode === this.definedCommanderResponse.ERROR) {
        BU.CLI(parsedData);
        BU.errorLog('inverter', 'parsingError', parsedData);
        // return this.requestTakeAction(this.definedCommanderResponse.RETRY);
        return this.requestTakeAction(this.definedCommanderResponse.RETRY);
      }


      parsedData.eventCode === this.definedCommanderResponse.DONE && this.model.onData(parsedData.data);

      // Device Client로 해당 이벤트 Code를 보냄
      BU.CLIN(this.getDeviceOperationInfo().data);
      return this.requestTakeAction(parsedData.eventCode);
    } catch (error) {
      BU.CLI(error);
      BU.logFile(error);
    }
  }
}
module.exports = Control;