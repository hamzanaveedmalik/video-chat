import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './Components/Users/UserComponent.js'
import Coaches from './Components/Coaches/CoachComponent.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Users/>
        <Coaches/>
      </div>
    );
  }
}

export default App;
