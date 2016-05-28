import { Constants } from '../constants';

const initState = {
  fetching: true,
  mocks: [],
  mock: {},
  newMock: {},
  error: null
};

export default function reducer(state = initState, action = {}) {
  switch(action.type) {

    case Constants.MOCKS_FETCHING:
      return {
        ...state,
        fetching: true,
        mock: {}
      }

    case Constants.MOCKS_FETCHING_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error
      }

    case Constants.MOCKS_RECEIVED:
      return {
        ...state,
        fetching: false,
        mocks: action.payload
      }

    case Constants.MOCK_RECEIVED:
      return {
        ...state,
        fetching: false,
        mock: action.payload
      }

    case Constants.MOCK_FETCHING_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error
      }

    case Constants.MOCK_CREATED:
      return {
        ...state,
        fetching: false,
        mock: action.payload
      }

    case Constants.MOCK_EDITED:
      return {
        ...state,
        fetching: false,
        mock: action.payload
      }

    case Constants.MOCK_DELETED:
      return {
        ...state,
        fetching: false,
        error: null,
        mock: {},
        mocks: [],
        newMock: {}
      }

    default:
      return state;
  }
}
