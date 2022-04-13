import axios from 'axios';

export default axios.create({
  baseURL: 'https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/entries',
  headers: {
    'Content-type': 'application/json',
  },
});