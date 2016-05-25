import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Hello React</h1>
      </div>
    );
  }
}

const node = document.getElementById('app');

render(<App />, node);
