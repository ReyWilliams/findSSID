import http from '../http-common';
const { EJSON } = require('bson');

class DataService {
	getAP() {
		return http.get(`/getEntries`);
	}

	getAPsByName(name) {
		return http.get(`/getEntryByName?name=${name}`);
	}

	parseAPList(APList) {
		return APList.map((ap_point) => {
			return (ap_point = EJSON.parse(JSON.stringify(ap_point), {
				strict: false,
			}));
		});
	}
}


export default new DataService();
