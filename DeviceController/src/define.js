
/**
 * @typedef {Object} deviceInfo deviceInfo 생성 자료 구조
 * @property {string} target_id device ID (dialing, id, ...)
 * @property {string} target_category inverter, connector, weather
 * @property {string=} target_name IVT_001, IVT_002, 인버터 1, alias
 * @property {logOption=} logOption 일어나는 이벤트에 대해 FileSystem 처리할 항목
 * @property {controlInfo} controlInfo DCC를 제어하는데 있어 운영상 필요한 boolean 값 모음
 * @property {connect_info} connect_info 장치와의 접속 정보
 * @property {protocol_info} protocol_info 프로토콜 생성자에 넘겨줄 설정 데이터
 */

/**
 * @typedef {Object} controlInfo DCC를 제어하는데 있어 운영상 필요한 boolean 값 모음
 * @prop {boolean} hasOneAndOne 계속하여 연결을 수립할지 여부
 * @prop {boolean} hasErrorHandling 에러가 발생하였을 경우 다음 명령 진행을 멈출지 여부
 * @prop {boolean} hasReconnect 장치의 연결이 끊겼을 경우 자동으로 재접속을 수행할지 여부
 */ 

/**
 * @typedef {Object} logOption 일어나는 이벤트에 대해 FileSystem 처리할 항목
 * @property {boolean} hasDcEvent Connect, Disconnect
 * @property {boolean} hasDcError Timeout, Incorrect, Unhandling, ...
 * @property {boolean} hasDcMessage ExecutionTerminate, OneAndOne, Delete Success
 * @property {boolean} hasTransferCommand 요청 Data 
 * @property {boolean} hasCommanderResponse 데이터에 대한 Commander의 요청
 * @property {boolean} hasReceiveData 수신 Data 
 */

/**
 * @typedef {Object} connect_info 장치와의 접속 정보
 * @property {string} type 'socket', 'serial', 'zigbee', ...
 * @property {string=} subType 'parser', 'xbee', ....
 * @property {number=} baudRate 
 * @property {string=|number=} port 
 * @property {string=} host 접속 경로(socket 일 경우 사용)
 * @property {Object=} addConfigInfo type, subType의 Contoller에서 요구하는 추가 접속 정보
 */

/** 
 * @typedef {Object} protocol_info 프로토콜 생성자에 넘겨줄 설정 데이터
 * @property {string} mainCategory
 * @property {string} subCategory
 * @property {string|Buffer} deviceId
 * @property {protocolOptionInfo=} protocolOptionInfo
 * @property {Object=} option
 */

/**
 * @typedef {Object} protocolOptionInfo 
 * @property {boolean} hasTrackingData  전송 데이터가 같으나 파싱이 실패할 경우 데이터 누적을 할지 여부 (Default: false)
 */ 