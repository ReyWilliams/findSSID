import http from '../http-common-entries';
const { EJSON } = require('bson');

class EntryDataService {
	getAPs() {
		return http.get(`/getAllEntries`);
	}

	getPOSAPs() {
		return http.get(`/getAllPOSEntries`);
	}

	getAPsByName(name) {
		return http.get(`/getEntriesByName?name=${name}`);
	}

	getAPsByAddress(address) {
		return http.get(`/getEntriesByAddress?address=${address}`);
	}
	getEntriesByAddress;
	parseAPList(APList) {
		return APList.map((ap_point) => {
			return (ap_point = EJSON.parse(JSON.stringify(ap_point), {
				strict: false,
			}));
		});
	}
}

export default new EntryDataService();
