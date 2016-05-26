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

    default:
      return state;
  }
}
