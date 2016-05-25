import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMock } from '../../actions/mocks';
import { Link } from 'react-router';

class MockNewView extends Component {

  handleSubmit(e) {
    e.preventDefault();

    const { name, method, url, response } = this.refs

    this.props.dispatch(createMock({
      name: name.value,
      method: method.value,
      url: url.value,
      response: response.value
    }));
  }

  render() {
    const { mock } = this.props

    return (
      <div className="container">
        <div className="columns">
          <div className="column col-md-12">
            <Link to="/" className="btn">Back to Home</Link>
          </div>
        </div>
        <div className="columns">
          <div className="column col-md-12">
            <form onSubmit={::this.handleSubmit}>
              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label" for="name">Name</label>
                </div>
                <div className="column col-md-8">
                  <input ref="name" className="form-input" type="text" id="name" placeholder="Name" />
                </div>
              </div>

              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label">Options</label>
                </div>
                <div className="column col-md-8">
                  <select ref="method" className="form-select" >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label" for="endpoint">Endpoint</label>
                </div>
                <div className="column col-md-8">
                  <input ref="url" className="form-input" type="text" id="endpoint" placeholder="Endpoint" />
                </div>
              </div>

              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label">Response</label>
                </div>
                <div className="column col-md-8">
                  <textarea ref="response" className="form-input" id="response" placeholder="JSON response" rows="5"/>
                </div>
              </div>

              <div className="form-group">
                <button className="btn btn-primary" type="submit">Submit</button>
                <Link className="btn btn-link" to="/">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  newMock: state.mocks.newMock
});

export default connect(mapStateToProps)(MockNewView)
