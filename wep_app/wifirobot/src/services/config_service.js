import http from '../http-common-config.js';
const { EJSON } = require('bson');

class ConfigDataService {
    setCurrCommand = (name) => {
        return http.post(`/setComm?name=${name}`)
    }

    getCurrCommand = () => {
      return http.get('/getComm')
    }

}

export default new ConfigDataService();
