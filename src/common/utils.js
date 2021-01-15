import * as Sentry from '@sentry/browser';

export const sendMessage = (tabId, type, message) => {
  return new Promise(resolve => {
    chrome.tabs &&
      chrome.tabs.sendMessage(Number(tabId), { type, message }, data => {
        resolve(data);
      });
  });
};

export const sendBGMessage = (type, message) => {
  return new Promise(resolve => {
    chrome.runtime &&
      chrome.runtime.sendMessage({ type, message }, data => {
        if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
          const { message } = chrome.runtime.lastError;
          switch (message) {
            case 'The message port closed before a response was received.':
              return;
            default:
              Sentry.captureException(chrome.runtime.lastError);
          }
        }
        resolve(data);
      });
  });
};

export const genUUID = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);
