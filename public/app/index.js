import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, browserHistory } from 'react-router';
import { createStore } from 'redux';
import mockApp from './reducers';

import MockIndexView from './containers/mocks/index';
import MockShowView from './containers/mocks/show';

const store = createStore(mockApp);

const target = document.getElementById('app');
const node = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={MockIndexView} />
      <Route path="/:id" component={MockShowView} />
    </Router>
  </Provider>
);

render(node, target);
