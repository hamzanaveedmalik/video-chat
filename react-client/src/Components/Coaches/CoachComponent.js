import React, { Component } from 'react';
import './Style/style.css';

class Coach extends Component {
constructor() {
  super();
  this.state = {
    coaches:[]
  }
}

componentDidMount() {
  fetch('http://localhost:3000/coaches')
  .then( data => data.json())
  .then( coaches => this.setState({coaches: coaches.payload}, () =>  console.log('Coaches fetched : ',coaches)));
}

  render() {
    return (
      <div >
      <h1> Coaches </h1>
        <ul>
        { this.state.coaches.map( coach =>
        <li key={coach._id}> {coach.firstName} {coach.lastName} </li>)}
        </ul>
      </div>
    );
  }
}

export default Coach;
