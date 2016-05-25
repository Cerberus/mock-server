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
        fetching: true
      }

    case Constants.MOCKS_RECEIVED:
      return {
        ...state,
        fetching: false,
        mocks: action.payload
      }

    default:
      return state;
  }
}
