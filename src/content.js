import * as Sentry from '@sentry/browser';
import {
  renderCharacter,
  renderCharacterStats,
  renderPopOutBtn
} from './content/ui';
import { fetchCharacter } from './common/api';
import { listCharacters } from './content/utils';

import './content/style.scss';
import { sendBGMessage } from './common/utils';

Sentry.init({
  dsn: 'https://8c8410ba6357492d9be342e42e81628e@sentry.io/1865332'
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    if (request.message === 'enableScreen') {
      enableScreen();
    }
    if (request.type === 'fetch') {
      fetchCharacter(request.message)
        .then(character => sendResponse(character))
        .catch(e => {
          console.log(
            `[DM Screen] Failed to load character ${request.message}`,
            e
          );
        });
    }
    return true;
  } catch (err) {
    Sentry.captureException(err);
  }
});

function enableScreen(config) {
  try {
    sendBGMessage('analytics', {
      type: 'pageview',
      title: 'embedded',
      page: 'content.js'
    });
    listCharacters().forEach(({ id }) =>
      fetchCharacter(id)
        .then(renderCharacter)
        .catch(e => {
          console.log(`[DM Screen] Failed to load character ${id}`, e);
        })
    );

    setTimeout(() => refreshData(config), config.refreshTime * 1000);
  } catch (err) {
    Sentry.captureException(err);
  }
}

function refreshData(config) {
  try {
    if (!config.refresh) return;

    listCharacters().forEach(({ id }) =>
      fetchCharacter(id)
        .then(renderCharacter)
        .catch(e => {
          console.log(`[DM Screen] Failed to load character ${id}`, e);
        })
    );

    setTimeout(() => refreshData(config), config.refreshTime * 1000);
  } catch (err) {
    Sentry.captureException(err);
  }
}

chrome.storage.sync.get('config', function(data) {
  try {
    const { config } = data;

    if (config.autoload) enableScreen(config);

    renderPopOutBtn();
  } catch (err) {
    Sentry.captureException(err);
  }
});
