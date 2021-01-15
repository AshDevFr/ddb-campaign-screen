import * as Sentry from '@sentry/browser';
import { analyticsCode } from './analytics';

Sentry.init({
  dsn: 'https://8c8410ba6357492d9be342e42e81628e@sentry.io/1865332'
});

// prettier-ignore
(function(i, s, o, g, r, a, m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', analyticsCode, 'auto', 'dmTracker');
ga('dmTracker.set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('dmTracker.require', 'displayfeatures');
ga('dmTracker.set', 'appVersion', chrome.runtime.getManifest().version);
ga('dmTracker.send', {
  hitType: 'event',
  eventCategory: 'Generic',
  eventAction: 'Loading',
  eventLabel: 'version',
  eventValue: chrome.runtime.getManifest().version
});

chrome.runtime.onInstalled.addListener(function(details) {
  try {
    if (details && details.reason === 'install') {
      chrome.storage.sync.set(
        {
          config: {
            autoload: true,
            refresh: true,
            refreshTime: 60,
            ui: {
              hp: true,
              stats: true
            }
          }
        },
        null
      );
    } else if (details && details.reason === 'update') {
      const newVersion = chrome.runtime.getManifest().version;
      console.log(`Updated from ${details.previousVersion} to ${newVersion} !`);
    }
  } catch (err) {
    Sentry.captureException(err);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  try {
    if (request.type === 'popOut') {
      popOut(sender.tab.id, request.message);
    }
    if (request.type === 'analytics') {
      if (request.message.type === 'pageview')
        ga('dmTracker.send', {
          hitType: 'pageview',
          page: request.message.page,
          title: request.message.title
        });
    }
  } catch (err) {
    Sentry.captureException(err);
  }
});

function popOut(openerTabId, ids) {
  try {
    chrome.tabs.create(
      {
        url: chrome.extension.getURL(
          `screen.html?ids=${(ids || []).join(',')}&tabId=${openerTabId}`
        ),
        active: false,
        openerTabId
      },
      function(tab) {
        chrome.windows.create({
          tabId: tab.id,
          type: 'popup',
          focused: true,
          height: 1024,
          width: 1280,
          left: 0,
          top: 0
        });
      }
    );
  } catch (err) {
    Sentry.captureException(err);
  }
}
