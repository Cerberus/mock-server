import Constants from '../constants';

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

      }

    case Constants.MOCKS_RECEIVED:
      return {

      }

    default:
      return state;
  }
}
