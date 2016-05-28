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
    it('should handle MOCKS_FETCHING', () => {
      expect(mocks(initialState, {
        type: 'MOCKS_FETCHING'
      }))
      .to.eql({
        error: null,
        fetching: true,
        mocks: [],
        mock: {},
        newMock: {}
      });
    });

    it('should handle MOCKS_RECEIVED', () => {

      const mockResult = [
        { id: '001', title: 'title1', url: 'http://localhost:1234', method: 'GET', response: '{}'},
        { id: '002', title: 'title2', url: 'http://localhost:1234/name', method: 'GET', response: '{}'},
        { id: '003', title: 'title3', url: 'http://localhost:1234/name2', method: 'GET', response: '{}'}
      ];
      expect(mocks(initialState, {
        type: 'MOCKS_RECEIVED',
        payload: mockResult
      }))
      .to.eql({
        error: null,
        fetching: false,
        mocks: mockResult,
        mock: {},
        newMock: {}
      });
    });
    it('should handle MOCKS_FETCHING_ERROR', () => {
      expect(mocks(initialState, {
        type: 'MOCKS_FETCHING_ERROR',
        error: 'something went wrong'
      }))
      .to.eql({
        error: 'something went wrong',
        fetching: false,
        mocks: [],
        mock: {},
        newMock: {}
      });
    });
  });

  describe('Mock', () => {
    it('should handle MOCK_FETCHING', () => {
      expect(mocks(initialState, {
        type: 'MOCK_FETCHING'
      }))
      .to.eql({
        error: null,
        fetching: true,
        mocks: [],
        mock: {},
        newMock: {}
      });
    });
    it('should handle MOCK_RECEIVED', () => {
      expect(mocks(initialState, {
        type: 'MOCK_RECEIVED',
        payload: { id: '001', name: 'name', url: 'url', response: 'response'}
      }))
      .to.eql({
        error: null,
        fetching: false,
        mocks: [],
        mock: { id: '001', name: 'name', url: 'url', response: 'response'},
        newMock: {}
      });
    });
    it('should handle MOCK_FETCHING_ERROR', () => {
      expect(mocks(initialState, {
        type: 'MOCK_FETCHING_ERROR',
        error: 'something went wrong'
      }))
      .to.eql({
        error: 'something went wrong',
        fetching: false,
        mocks: [],
        mock: {},
        newMock: {}
      });
    });
    it('should handle MOCK_CREATED', () => {

      expect(mocks(initialState, {
        type: 'MOCK_CREATED',
        payload: {
          id: 1,
          name: 'test',
          method: 'GET',
          url: '/api/test',
          response: {}
        }
      }))
      .to.eql({
        error: null,
        fetching: false,
        mock: {
          id: 1,
          name: 'test',
          method: 'GET',
          url: '/api/test',
          response: {}
        },
        mocks: [],
        newMock: {}
      });
    });
    it('should handle MOCK_EDITED', () => {

      expect(mocks(initialState, {
        type: 'MOCK_EDITED',
        payload: {
          id: 1,
          name: 'test after edited',
          method: 'GET',
          url: '/api/test',
          response: {}
        }
      }))
      .to.eql({
        error: null,
        fetching: false,
        mocks: [],
        newMock: {},
        mock: {
          id: 1,
          name: 'test after edited',
          method: 'GET',
          url: '/api/test',
          response: {}
        }
      });
    });
    it('should handle MOCK_DELETE', () => {

      expect(mocks(initialState, {
        type: 'MOCK_DELETED',
        payload: { message: 'deleted'}
      }))
      .to.eql({
        fetching: false,
        error: null,
        mock: {},
        mocks: [],
        newMock: {}
      });
    });
  });

});
