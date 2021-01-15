export const getDivId = characterId => `character-screen-${characterId}`;

export const combatStatsTemplate = `<div class="ddbdms__container "></div>`;
export const combatStatsTemplate2 = `<div class="ddbdms__container "></div>`;
export const modificatorStatsTemplate = `<div class="ddbdms__container "></div>`;
export const passiveStatsTemplate = `<div class="ddbdms__container "></div>`;

export const initiativeBlock = `
<div class="ddbdms__block ddbdms__initiative">
  <div class="ddbdms__value">
    <span class="ddbdms__number ddbdms__large">
      <span class="ddbdms__sign"></span>
      <span class="ddbdms__initiative__value"></span>
    </span>
  </div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">initiative</div>
  </div>
</div>
`;

export const armorClassBlock = `
<div class="ddbdms__block ddbdms__ac">
  <div class="ddbdms__heading">
    <div class="ddbdms__label">armor</div>
  </div>
  <div class="ddbdms__value"></div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">Class</div>
  </div>
</div>
`;

export const hitPointBlock = `
<div class="ddbdms__block ddbdms__hp">
  <div class="ddbdms__value">
    <span class="ddbdms__hp__current"></span>
    <span>/</span>
    <span class="ddbdms__hp_max"></span>
  </div>
    <div class="ddbdms__label">Hit Points</div>
  </div>
</div>
`;

export const speedBlock = `
<div class="ddbdms__block ddbdms__speed">
  <div class="ddbdms__heading">
    <div class="ddbdms__label">Speed</div>
  </div>
  <div class="ddbdms__inlineGroup"></div>
</div>
`;

export const speedItemBlock = (type, value) => `
<div class="ddbdms__inlineGroup--item ddbdms__speedItem">
  <div class="ddbdms__value">
    <span class="ddbdms__distance">
      <span class="ddbdms__distance--number">${value}</span>
      <span class="ddbdms__distance--label">ft.</span>
    </span>
  </div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">${type}</div>
  </div>
</div>
`;

export const saveDcBlock = `
<div class="ddbdms__block ddbdms__savedc">
  <div class="ddbdms__heading">
    <div class="ddbdms__label">Save DC</div>
  </div>
  <div class="ddbdms__inlineGroup"></div>
</div>
`;

export const saveDcItemBlock = (type, value) => `
<div class="ddbdms__inlineGroup--item ddbdms__saveItem">
  <div class="ddbdms__value">${value}</div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">${type}</div>
  </div>
</div>
`;

export const savingThrowsBlock = `
<div class="ddbdms__block ddbdms__savingThrow">
  <div class="ddbdms__heading">
    <div class="ddbdms__label">Saving Throws</div>
  </div>
  <div class="ddbdms__inlineGroup"></div>
</div>
`;

export const savingThrowsItemBlock = (type, value) => `
<div class="ddbdms__inlineGroup--item ddbdms__savingThrowsItem">
  <div class="ddbdms__value">
    <span class="ddbdms__number ddbdms__large">
      <span class="ddbdms__sign">${value >= 0 ? '+' : '-'}</span>
      <span>${Math.abs(value)}</span>
    </span>
  </div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">${type}</div>
  </div>
</div>
`;

export const passiveSkillsBlock = `
<div class="ddbdms__block ddbdms__passiveSkills">
  <div class="ddbdms__heading">
    <div class="ddbdms__label">Passive Skills</div>
  </div>
  <div class="ddbdms__inlineGroup"></div>
  <div class="ddbdms__senses"></div>
</div>
`;

export const passiveSkillsItemBlock = (type, value, bonus) => `
<div class="ddbdms__inlineGroup--item ddbdms__passiveSkillsItem">
  <div class="ddbdms__value">${value + bonus}</div>
  <div class="ddbdms__footer">
    <div class="ddbdms__label">${type}</div>
  </div>
</div>
`;

export const senseItem = value => `<span>${value}</div>`;
