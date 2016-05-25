import { Constants, API } from '../constants';
import { push } from 'react-router-redux';
import axios from 'axios';

export function fetchMocks() {
  return dispatch => {

    dispatch({
      type: Constants.MOCKS_FETCHING
    });

    axios.get(API.mocks)
    .then(result => {

      const response = result.data;

      if (response.statusCode === 1000) {
        dispatch({
          type: Constants.MOCKS_RECEIVED,
          payload: response.data
        });
      } else {
        dispatch({
          type: Constants.MOCKS_FETCHING_ERROR,
          error: response.statusMessage
        });
      }

    })
    .catch(error => {
      dispatch({
        type: Constants.MOCKS_FETCHING_ERROR,
        error: error
      });
    });

  };
};

export function fetchMock(id) {
  return dispatch => {

    dispatch({
      type: Constants.MOCK_FETCHING
    });

    let url = API.mock.replace(':id', id);
    console.log('fetchMock : ' + url);
    axios.get(url)
    .then(result => {
      
      const response = result.data;

      if (response.statusCode === 1000) {
        dispatch({
          type: Constants.MOCK_RECEIVED,
          payload: response.data
        });
      } else {
        dispatch({
          type: Constants.MOCK_FETCHING_ERROR,
          error: response.statusMessage
        });
      }

    })
    .catch(error => {
      dispatch({
        type: Constants.MOCK_FETCHING_ERROR,
        error: error
      });
    });
  }
};

export function createMock(data) {
  return dispatch => {

    console.log('createMock ===>');

    axios.post(API.mocks, data)
    .then(result => {

      const response = result.data;

      console.log('inside result));');
      console.log(JSON.stringify(response));

      if (response.statusCode === 1000) {
        dispatch({
          type: Constants.MOCK_CREATED
        });
        dispatch(push('/'));
      } else {
        dispatch({
          type: Constants.MOCK_CREATE_ERROR,
          error: response.statusMessage
        });
      }
    })
    .catch(error => {
      dispatch({
        type: Constants.MOCK_CREATE_ERROR,
        error: error
      });
    });
  }
};

export function editMock(data) {
  // TODO
};

