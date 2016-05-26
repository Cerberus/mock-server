import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMock, editMock } from '../../actions/mocks';
import { Link } from 'react-router';

class MockShowView extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    const { id } = this.props.params

    dispatch(fetchMock(id));
  }

  handleSubmit(e) {
    e.preventDefault();

    const { name, method, url, response } = this.refs

    this.props.dispatch(editMock({
      name: name.value,
      method: method.value,
      url: url.value,
      response: response.value
    }));
  }

  render() {
    const { mock } = this.props


    let jsonResponse;

    if (mock.response) {
      jsonResponse = JSON.stringify(JSON.parse(mock.response), null, 4) || ''
    } else {
      jsonResponse = mock.response
    }

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
                  <input ref="name" defaultValue={mock.name} className="form-input" type="text" id="name" placeholder="Name" />
                </div>
              </div>

              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label">Options</label>
                </div>
                <div className="column col-md-8">
                  <select ref="method" className="form-select" defaultValue={mock.method}>
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
                  <input ref="url" defaultValue={mock.url} className="form-input" type="text" id="endpoint" placeholder="Endpoint" />
                </div>
              </div>

              <div className="form-group">
                <div className="column col-md-4">
                  <label className="form-label">Response</label>
                </div>
                <div className="column col-md-8">
                  <textarea ref="response" defaultValue={jsonResponse} className="form-input" id="response" placeholder="JSON response" rows="5"/>
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
  mock: state.mocks.mock
});

export default connect(mapStateToProps)(MockShowView)
