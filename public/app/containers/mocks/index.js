import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMocks } from '../../../actions/mocks';
import { Link } from 'react-router';

class MockIndexView extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchMocks())
  }

  render() {
    const { mocks } = this.props

    return <h1>MockIndexView</h1>
  }
};

const mapStateToProps = (state) => (
  state.mocks || {}
);

export default connect(mapStateToProps)(MockIndexView)
