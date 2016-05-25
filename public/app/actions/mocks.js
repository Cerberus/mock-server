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

