import { expect } from 'chai';
import mocks from '../../../public/app/reducers/mocks';

describe('Mocks Reducers', () => {

  let initialState = {
    fetching: true,
    error: null,
    mocks: [],
    mock: {},
    newMock: {}
  };

  it('should have initialState', () => {

    expect(mocks(undefined, {}))
    .to.eql(initialState);
  });

  describe('Mocks', () => {
    xit('should handle MOCKS_FETCHING', () => {});
    xit('should handle MOCKS_RECEIVED', () => {});
    xit('should handle MOCKS_FETCHING_ERROR', () => {});
  });

  describe('Mock', () => {
    xit('should handle MOCK_FETCHING', () => {});
    xit('should handle MOCK_FETCHING_ERROR', () => {});
    xit('should handle MOCK_RECEIVED', () => {});
    xit('should handle MOCK_CREATED', () => {});
    xit('should handle MOCK_EDITED', () => {});
    xit('should handle MOCK_DELETE', () => {});
  });

});
