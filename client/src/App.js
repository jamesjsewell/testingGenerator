import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const TestView1 = props => (
  <div>
    <h4>Test 1</h4>
  </div>
);
const TestView2 = props => (
  <div>
    <h4>Test 2</h4>
  </div>
);
const TestView3 = props => (
  <div>
    <h4>Test 3</h4>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResult: 'Contacting Api... this *should* not take long',
    };
    this.testApi();
  }
  testApi = async () => {
    var result = await axios.get('/api/test');
    if (!result) return this.setState({ apiResult: 'api is not working' });
    if (!result.data) return this.setState({ apiResult: 'api is not working' });
    this.setState({ apiResult: result.data });
  };
  render() {
    return (
      <div className="App">
        <h2>{this.state.apiResult}</h2>
        <BrowserRouter>
          <div>
            <Route exact path="/test1" component={TestView1} />
            <Route exact path="/test1/test2" component={TestView2} />
            <Route exact path="/test1/test2/test3" component={TestView3} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
