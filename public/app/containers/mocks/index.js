import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMocks } from '../../actions/mocks';
import { Link } from 'react-router';

class MockIndexView extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchMocks())
  }

  render() {

    const { mocks } = this.props

    return (
      <div className="container">
        <div className="columns">
          <div className="column col-md-12">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="column col-md-2">Name</th>
                  <th className="column col-md-1">Method</th>
                  <th className="column col-md-4">Endpoint</th>
                  <th className="column col-md-4">Response</th>
                  <th className="column col-md-1">Action</th>
                </tr>
              </thead>
              <tbody>
  
                {mocks.map(mock => {

                  return (
                    <tr className="selected">
                      <td>{mock.name}</td>
                      <td>{mock.method}</td>
                      <td>{mock.url}</td>
                      <td>{mock.response}</td>
                      <td><Link to={mock._id} className="btn">Edit</Link></td>
                    </tr>
                  )
                })}

              </tbody>
          </table>
          </div>
        </div>
      </div>
    )
  }
};

const mapStateToProps = (state) => (
  state.mocks || {}
);

export default connect(mapStateToProps)(MockIndexView)
