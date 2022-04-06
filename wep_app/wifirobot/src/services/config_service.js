import http from '../http-common-config.js';
const { EJSON } = require('bson');

class ConfigDataService {
	setCurrCommand = (name) => {
		return http.post(`/setComm?name=${name}`);
	};

	getCurrCommand = () => {
		return http.get('/getComm');
	};

	setSessionTime = () => {
		return http.post(`/setSessionTime`);
	};

	getSessionTime = () => {
		return http.get('/getSessionTime');
	};

	getRobotAck = () => {
		return http.get('/getRobotAck');
	};
}

export default new ConfigDataService();
