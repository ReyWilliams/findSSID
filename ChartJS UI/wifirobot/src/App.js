import './App.css';
import DataService from './services/ap_entries'
import React, { useState, useEffect } from 'react';


const App = () => {

  const [ap, setAP] = useState({});

  const getAP = () => {
    DataService.getAP()
    .then((response) => {
      setAP(response.data);
      console.log("getAP() response: " + JSON.stringify(response.data));
    })
    .catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {
    getAP();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
        AP List
        </h1>
        {JSON.stringify(ap[0])}
        {/*{ap[0].}*/}
      </header>
    </div>
  );
}

export default App;
