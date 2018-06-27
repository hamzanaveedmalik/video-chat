import React, { Component } from 'react';
import './Style/style.css';

class Users extends Component {
constructor() {
  super();
  this.state = {
    users:[]
  }
}

componentDidMount() {
  fetch('http://localhost:3000/users')
  .then( data => data.json())
  .then( users => this.setState({users: users.payload}, () =>  console.log('Users fetched : ',users)));
}

  render() {
    return (
      <div className="App">
      <h1> Users </h1>
        <ul>
        { this.state.users.map( user =>
        <li key={user._id}> {user.firstName} {user.lastName} </li>)}
        </ul>
      </div>
    );
  }
}

export default Users;
