import { h, render } from 'preact';
import Router from 'preact-router';
import styled from 'styled-components';
import { createLogger } from 'redux-logger';
import { Provider, useDispatch } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';

import Menu from './screen/components/menu';
import CharactersPage from './screen/charactersPage';
import rootReducer from './screen/app/reducers';
import { addId } from './screen/app/optionsSlice';
import { analyticsCode } from './analytics';

Sentry.init({
  dsn: 'https://8c8410ba6357492d9be342e42e81628e@sentry.io/1865332'
});
ReactGA.initialize(analyticsCode);
ReactGA.ga('set', 'checkProtocolTask', function() {});
ReactGA.ga('require', 'displayfeatures');
ReactGA.ga('set', 'appVersion', chrome.runtime.getManifest().version);
ReactGA.pageview('/screen.html');

import './screen/style.scss';

const middlewares = [];
if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger();
  middlewares.push(loggerMiddleware);
}

const AppContainer = styled.div`
  background-color: #25282a;
  color: white;
`;

const Title = styled.h1`
  background-color: #090809;
  text-align: center;
  border-bottom: 1px solid #838383;
  padding: 20px;
  margin-top: 0;
`;

const RedSpan = styled.span`
  color: red;
  font-weight: bold;
`;

const MainContainer = styled.div``;

const store = configureStore({
  reducer: rootReducer,
  middleware: [...middlewares, ...getDefaultMiddleware()]
});

const App = ({ config }) => {
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const tabId = searchParams.get('tabId');
  const ids = searchParams.get('ids');
  (ids || '').split(',').forEach(id => dispatch(addId(id)));

  return (
    <AppContainer id="app-root">
      <Title>
        <RedSpan>D&D</RedSpan> Beyond Campaign DM Screen
      </Title>
      <MainContainer>
        <Router>
          <CharactersPage config={config} tabId={tabId} path="/" default />
        </Router>
      </MainContainer>
      <Menu />
    </AppContainer>
  );
};

const Main = ({ config }) => (
  <Provider store={store}>
    <App config={config}></App>
  </Provider>
);

chrome.storage.sync.get('config', function(data) {
  const { config } = data;

  render(<Main config={config} />, document.body);
});
