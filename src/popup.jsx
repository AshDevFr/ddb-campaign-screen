import { h, render } from 'preact';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';
import App from './popup/app';
import { analyticsCode } from './analytics';

Sentry.init({
  dsn: 'https://8c8410ba6357492d9be342e42e81628e@sentry.io/1865332'
});
ReactGA.initialize(analyticsCode);
ReactGA.ga('set', 'checkProtocolTask', function() {});
ReactGA.ga('require', 'displayfeatures');
ReactGA.ga('set', 'appVersion', chrome.runtime.getManifest().version);
ReactGA.pageview('/popup.html');

chrome.storage.sync.get('config', function(data) {
  const { config } = data;

  render(<App config={config} />, document.body);
});
