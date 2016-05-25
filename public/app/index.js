import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';

import MockIndexView from './containers/mocks/index';
import MockShowView from './containers/mocks/show';
import MockNewView from './containers/mocks/new';


const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});

const reduxRouterMiddleware = routerMiddleware(browserHistory);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunkMiddleware, loggerMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers);

const target = document.getElementById('app');
const node = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={MockIndexView} />
      <Route path="/new" component={MockNewView} />
      <Route path="/:id" component={MockShowView} />
    </Router>
  </Provider>
);

render(node, target);
