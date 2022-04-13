import axios from 'axios';

export default axios.create({
  baseURL: 'https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/config',
  headers: {
    'Content-type': 'application/json',
  },
});