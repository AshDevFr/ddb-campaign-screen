import $ from 'jquery';
import { sendBGMessage } from '../common/utils';
import {
  armorClassBlock,
  combatStatsTemplate,
  combatStatsTemplate2,
  getDivId,
  hitPointBlock,
  initiativeBlock,
  modificatorStatsTemplate,
  passiveSkillsBlock,
  passiveStatsTemplate,
  saveDcBlock,
  savingThrowsBlock,
  speedBlock
} from './ui-templates';
import {
  getArmorClass,
  getDcSaves,
  getHitPoints,
  getInitiative,
  getLevel,
  getName,
  getPassiveSkills,
  getSavingThrows,
  getSenses,
  getSpeeds,
  getStats
} from '../common/character-utils';
import {
  setAC,
  setDcSaves,
  setHP,
  setInitiative,
  setPassiveSkills,
  setSavingThrows,
  setSenses,
  setSpeeds
} from './ui-render';
import { listCharacters } from './utils';

export const renderPopOutBtn = () => {
  const btnContainer = $(
    '#site-main > header.page-header > div.page-header__extras  div.more-links > div.more-links__links'
  );

  if (!$(`#ddb-campaign-screen-links`).length) {
    const btnPopOut = $(`
      <a href="#"" class="button-alt button-alt-default">
        <span class="label">
          DM Screen
        </span>
      </a>
    `).click(() => {
      const { origin } = location;
      const ids = listCharacters().map(({ id }) => id);

      sendBGMessage('popOut', ids);
    });

    btnContainer.append(btnPopOut);
  }
};

export const renderCharacterTemplate = characterId => {
  const node = $(
    `a.ddb-campaigns-character-card-footer-links-item-view[href$="/${characterId}"]`
  );
  const divId = getDivId(characterId);

  if (!$(`#${divId}`).length) {
    const root = node.parents('.ddb-campaigns-character-card');
    const header = root.find('.ddb-campaigns-character-card-header');
    const block = $(
      `<div id="${divId}" class="character-screen-details"></div>`
    ).insertAfter(header);

    const combatStatsContainer = $(combatStatsTemplate).appendTo(block);
    const combatStatsContainer2 = $(combatStatsTemplate2).appendTo(block);
    const modificatorStatsContainer = $(modificatorStatsTemplate).appendTo(
      block
    );
    const passiveStatsContainer = $(passiveStatsTemplate).appendTo(block);

    combatStatsContainer.append(initiativeBlock);
    combatStatsContainer.append(armorClassBlock);
    combatStatsContainer.append(hitPointBlock);

    combatStatsContainer2.append(speedBlock);
    combatStatsContainer2.append(saveDcBlock);

    modificatorStatsContainer.append(savingThrowsBlock);

    passiveStatsContainer.append(passiveSkillsBlock);
  }
};

export const renderCharacterStats = character => {
  const stats = getStats(character);

  const initiative = getInitiative(character, stats);
  setInitiative(character.id, initiative);

  const hp = getHitPoints(character, stats);
  setHP(character.id, hp.current, hp.max);

  const ac = getArmorClass(character, stats);
  setAC(character.id, ac.total);

  setSpeeds(character.id, getSpeeds(character, stats, ac));

  setDcSaves(character.id, getDcSaves(character));

  setSavingThrows(character.id, getSavingThrows(character, stats));

  setPassiveSkills(character.id, getPassiveSkills(character, stats));

  setSenses(character.id, getSenses(character));
};

export const renderCharacter = character => {
  if (!character)
    return console.log(`[DM Screen] Failed to render a character`);

  renderCharacterTemplate(character.id);

  renderCharacterStats(character);
};
