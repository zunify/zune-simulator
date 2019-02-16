import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom"; 

import {Zune} from './routes'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path='/' component={Zune} />
      </Router>
    );
  }
}

export default App;
