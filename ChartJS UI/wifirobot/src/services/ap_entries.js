import http from "../http-common";

class DataService {
    getAP(){
        return http.get(`/getEntries`);
    }
}

export default new DataService();