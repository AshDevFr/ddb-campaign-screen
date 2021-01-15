const ABILITIES = {
  1: {
    shortName: 'STR',
    name: 'Strength',
    modifier: 'strength-score'
  },
  2: {
    shortName: 'DEX',
    name: 'Dexterity',
    modifier: 'dexterity-score'
  },
  3: {
    shortName: 'CON',
    name: 'Constitution',
    modifier: 'constitution-score'
  },
  4: {
    shortName: 'INT',
    name: 'Intelligence',
    modifier: 'intelligence-score'
  },
  5: {
    shortName: 'WIS',
    name: 'Wisdom',
    modifier: 'wisdom-score'
  },
  6: {
    shortName: 'CHA',
    name: 'Charisma',
    modifier: 'charisma-score'
  }
};

const ABILITY_MODIFIERS = {
  'strength-score': 1,
  'dexterity-score': 2,
  'constitution-score': 3,
  'intelligence-score': 4,
  'wisdom-score': 5,
  'charisma-score': 6
};

const ABILITY_PROFICIENCY_MODIFIERS = {
  'strength-saving-throws': 1,
  'dexterity-saving-throws': 2,
  'constitution-saving-throws': 3,
  'intelligence-saving-throws': 4,
  'wisdom-saving-throws': 5,
  'charisma-saving-throws': 6
};

const SKILLS = {
  2: { name: 'Athletics', abilityId: 1 },
  3: { name: 'Acrobatics', abilityId: 2 },
  4: { name: 'Sleight of Hand', abilityId: 2 },
  5: { name: 'Stealth', abilityId: 2 },
  6: { name: 'Arcana', abilityId: 4 },
  7: { name: 'History', abilityId: 4 },
  8: { name: 'Investigation', abilityId: 4 },
  9: { name: 'Nature', abilityId: 4 },
  10: { name: 'Religion', abilityId: 4 },
  11: { name: 'Animal Handling', abilityId: 5 },
  12: { name: 'Insight', abilityId: 5 },
  13: { name: 'Medicine', abilityId: 5 },
  14: { name: 'Perception', abilityId: 5 },
  15: { name: 'Survival', abilityId: 5 },
  16: { name: 'Deception', abilityId: 6 },
  17: { name: 'Intimidation', abilityId: 6 },
  18: { name: 'Performance', abilityId: 6 },
  19: { name: 'Persuasion', abilityId: 6 }
};

const SKILLS_TYPES = Object.values(SKILLS).map(skill =>
  skill.name.toLowerCase().replace(/\s/g, '-')
);

const asNumber = n => n || 0;

const getModifier = n => Math.floor((n - 10) / 2);

const getProficiencyBonus = level => {
  switch (true) {
    case level <= 4:
      return 2;
    case level > 4 && level <= 8:
      return 3;
    case level > 8 && level <= 12:
      return 4;
    case level > 12 && level <= 16:
      return 5;
    case level > 16:
      return 6;
  }
};

const findClassFeature = (character, id) =>
  character.classes
    .reduce(
      (featureList, classObj) => [
        ...featureList,
        ...classObj.definition.classFeatures
      ],
      []
    )
    .find(feature => feature.id === id);

const runModifiers = (character, initialValue, filterFn, execFn) => {
  const { modifiers } = character;

  return Object.keys(modifiers).reduce((currentValue, modifierType) => {
    return modifiers[modifierType]
      .filter(filterFn)
      .reduce(
        (currentExecValue, modifier) =>
          execFn(currentExecValue, modifier, modifierType),
        currentValue
      );
  }, initialValue);
};

const runInventory = (character, initialValue, filterFn, execFn) =>
  character.inventory.filter(filterFn).reduce(execFn, initialValue);

export const getStats = character => {
  const level = getLevel(character);
  const proficiencyBonus = getProficiencyBonus(level);
  let stats = character.stats.reduce((currentStats, { id, value }) => {
    const { shortName, name } = ABILITIES[id];
    currentStats[id] = {
      name,
      shortName,
      value
    };

    return currentStats;
  }, {});

  stats = character.bonusStats.reduce((currentStats, { id, value }) => {
    currentStats[id].bonus = value;
    return currentStats;
  }, stats);

  stats = character.overrideStats.reduce((currentStats, { id, value }) => {
    currentStats[id].override = value;
    return currentStats;
  }, stats);

  stats = runModifiers(
    character,
    stats,
    ({ type, subType }) =>
      (type === 'bonus' && Object.keys(ABILITY_MODIFIERS).includes(subType)) ||
      (type === 'proficiency' &&
        Object.keys(ABILITY_PROFICIENCY_MODIFIERS).includes(subType)),
    (currentStats, { subType, value }, modifierType) => {
      if (Object.keys(ABILITY_MODIFIERS).includes(subType)) {
        const id = ABILITY_MODIFIERS[subType];
        currentStats[id][`${modifierType}Bonus`] =
          (currentStats[id][`${modifierType}Bonus`] || 0) + value;
      }

      if (Object.keys(ABILITY_PROFICIENCY_MODIFIERS).includes(subType)) {
        const id = ABILITY_PROFICIENCY_MODIFIERS[subType];
        currentStats[id].proficiency = true;
      }
      return currentStats;
    }
  );

  return Object.entries(stats).reduce((currentStats, [id, ability_stats]) => {
    const {
      value,
      bonus,
      override,
      raceBonus,
      classBonus,
      backgroundBonus,
      itemBonus,
      featBonus,
      conditionBonus
    } = ability_stats;
    const total = Number.isInteger(override)
      ? override
      : asNumber(value) +
        asNumber(bonus) +
        asNumber(raceBonus) +
        asNumber(classBonus) +
        asNumber(backgroundBonus) +
        asNumber(itemBonus) +
        asNumber(featBonus) +
        asNumber(conditionBonus);

    ability_stats.total = total;
    ability_stats.modifier = getModifier(total);
    ability_stats.savingThrow = ability_stats.proficiency
      ? proficiencyBonus + ability_stats.modifier
      : ability_stats.modifier;

    currentStats[id] = ability_stats;
    return currentStats;
  }, {});
};

export const getName = character => character.name;

export const getLevel = character =>
  character.classes.reduce(
    (currentLevel, { level }) => currentLevel + level,
    0
  );

export const getHitPoints = (character, stats) => {
  const level = getLevel(character);
  stats = stats || getStats(character);
  let maxHP = 0;
  if (Number.isInteger(character.overrideHitPoints)) {
    maxHP = character.overrideHitPoints;
  } else {
    if (character.preferences.hitPointType === 1) {
      maxHP = character.classes.reduce((currentHP, classDef) => {
        if (classDef.isStartingClass) {
          return (
            currentHP +
            classDef.definition.hitDice +
            (classDef.level - 1) *
              Math.round(classDef.definition.hitDice * 0.6) +
            classDef.level * stats[3].modifier
          );
        } else {
          return (
            currentHP +
            (classDef.level * Math.round(classDef.definition.hitDice * 0.6) +
              stats[3].modifier)
          );
        }
      }, 0);
    }
    if (character.preferences.hitPointType === 2) {
      maxHP = character.baseHitPoints + level * stats[3].modifier;
    }
  }

  maxHP += character.bonusHitPoints || 0;

  maxHP = runModifiers(
    character,
    maxHP,
    ({ type, subType }) =>
      type === 'bonus' && subType === 'hit-points-per-level',
    (currentMxaHP, { value }) => {
      return currentMxaHP + value * level;
    }
  );

  const current = maxHP - character.removedHitPoints;

  return {
    current,
    max: maxHP,
    tmp: character.temporaryHitPoints
  };
};

export const getInitiative = (character, stats) => {
  stats = stats || getStats(character);
  const level = getLevel(character);
  const proficiencyBonus = getProficiencyBonus(level);

  return runModifiers(
    character,
    stats[2].modifier,
    ({ type, subType, isGranted }) =>
      ['half-proficiency', 'proficiency', 'expertise', 'bonus'].includes(
        type
      ) &&
      subType === 'initiative' &&
      isGranted,
    (currentInitiative, { type, value }) => {
      switch (type) {
        case 'expertise':
          return currentInitiative + proficiencyBonus * 2;
        case 'proficiency':
          return currentInitiative + proficiencyBonus;
        case 'half-proficiency':
          return currentInitiative + Math.floor(proficiencyBonus / 2);
        case 'bonus':
          return currentInitiative + value;
      }
    }
  );
};

export const getArmorClass = (character, stats) => {
  stats = stats || getStats(character);
  let ac = runInventory(
    character,
    {
      baseAC: 10 + stats[2].modifier, // DEX
      bonusAC: 0,
      shieldAC: 0,
      equippedItems: [],
      attunedItems: [],
      armor: {
        shield: false,
        light: false,
        medium: false,
        heavy: false
      }
    },
    item => item.equipped,
    (currentAC, { definition, isAttuned }) => {
      currentAC.equippedItems.push(definition.id);
      if (isAttuned) currentAC.attunedItems.push(definition.id);
      const itemType = definition.type || definition.filterType;
      const { baseArmorName } = definition;
      if (itemType && itemType.match(/^[\w\s]*armor$/i)) {
        if (itemType && itemType.match(/^light[\w\s]*$/i)) {
          currentAC.armor.light = true;
          currentAC.baseAC = definition.armorClass + stats[2].modifier;
        } else if (itemType && itemType.match(/^medium[\w\s]*$/i)) {
          currentAC.armor.medium = true;
          currentAC.baseAC = definition.armorClass + stats[2].modifier;
        } else if (itemType && itemType.match(/^heavy[\w\s]*$/i)) {
          currentAC.armor.heavy = true;
          currentAC.baseAC = definition.armorClass;
        } else if (baseArmorName.toLowerCase() === 'shield') {
          currentAC.shieldAC = definition.armorClass;
          currentAC.armor.shield = true;
        } else {
          currentAC.baseAC = definition.armorClass + stats[2].modifier;
        }
      } else if (itemType && itemType.toLowerCase() === 'shield') {
        currentAC.shieldAC = definition.armorClass;
        currentAC.armor.shield = true;
      } else {
        currentAC.bonusAC += Number.isInteger(definition.armorClass)
          ? definition.armorClass
          : 0;
      }
      return currentAC;
    }
  );

  ac = runModifiers(
    character,
    ac,
    ({ type, subType, componentId, requiresAttunement }) =>
      (type === 'bonus' &&
        subType === 'armor-class' &&
        ac.equippedItems.includes(componentId) &&
        (!requiresAttunement || ac.attunedItems.includes(componentId))) ||
      (type === 'bonus' &&
        ['armored-armor-class', 'unarmored-armor-class'].includes(subType)) ||
      (type === 'set' && subType === 'unarmored-armor-class'),
    (currentAC, { subType, statId, value }) => {
      if (subType === 'armored-armor-class') {
        if (
          !currentAC.armor.light &&
          !currentAC.armor.medium &&
          !currentAC.armor.heavy
        )
          return currentAC;
        currentAC.bonusAC += value;
      } else if (subType === 'unarmored-armor-class') {
        if (
          currentAC.armor.light ||
          currentAC.armor.medium ||
          currentAC.armor.heavy
        )
          return currentAC;
        currentAC.bonusAC += value || (statId ? stats[statId].modifier : 0);
      } else {
        currentAC.bonusAC += value;
      }

      return currentAC;
    }
  );

  const characterValues = character.characterValues || [];

  const overrideAC = characterValues.find(value => value.typeId === 1);

  const overrideBaseDex = characterValues.find(value => value.typeId === 4);

  const bonusMagic = characterValues.find(value => value.typeId === 2);

  const bonusMisc = characterValues.find(value => value.typeId === 3);

  ac.overrideAC = overrideAC ? overrideAC.value : null;
  ac.overrideBaseDex = overrideBaseDex ? overrideBaseDex.value : null;
  ac.bonusMagic = bonusMagic ? bonusMagic.value || 0 : 0;
  ac.bonusMisc = bonusMisc ? bonusMisc.value || 0 : 0;

  ac.total = Number.isInteger(ac.overrideAC)
    ? ac.overrideAC
    : (Number.isInteger(ac.overrideBaseDex) ? ac.overrideBaseDex : ac.baseAC) +
      ac.bonusAC +
      ac.shieldAC +
      ac.bonusMagic +
      ac.bonusMisc;

  return ac;
};

export const getSpeeds = (character, stats, ac) => {
  stats = stats || getStats(character);
  ac = ac || getArmorClass(character, stats);
  const hasArmor = Object.values(ac.armor).reduce(
    (currentBool, bool) => currentBool || bool,
    false
  );

  const speedBonus = runModifiers(
    character,
    { bonus: 0, override: {} },
    ({ type, subType }) =>
      (type === 'bonus' && ['unarmored-movement', 'speed'].includes(subType)) ||
      (type === 'set' && subType.match(/innate-speed-.*/i)),
    (currentValue, { componentId, type, subType, value }) => {
      if (subType === 'unarmored-movement' && hasArmor) return currentValue;

      if (type === 'bonus') {
        const feature = findClassFeature(character, componentId);
        if (!feature || feature.name !== 'Fast Movement' || !ac.armor.heavy)
          currentValue.bonus += value;
      }
      if (type === 'set') {
        const speedType = subType.match(/innate-speed-(.*)ing/);
        if (!speedType || !speedType[1]) return currentValue;
        if (
          currentValue.override[speedType[1]] &&
          currentValue.override[speedType[1]] > value
        )
          return currentValue;
        currentValue.override[speedType[1]] = value;
      }
      return currentValue;
    }
  );

  return Object.entries(character.race.weightSpeeds.normal)
    .filter(([_type, value]) => value > 0)
    .map(([type, value]) => {
      const base = speedBonus.override[type]
        ? speedBonus.override[type]
        : value;
      return {
        type,
        value: base + speedBonus.bonus
      };
    });
};

export const getDcSaves = (character, stats) => {
  stats = stats || getStats(character);
  const level = getLevel(character);
  const proficiencyBonus = getProficiencyBonus(level);
  return character.classes.map(({ definition }) => {
    const { name, spellCastingAbilityId } = definition;

    if (!spellCastingAbilityId)
      return {
        type: 'No save',
        value: 0
      };

    return {
      type: name,
      value: 8 + stats[spellCastingAbilityId].modifier + proficiencyBonus
    };
  });
};

export const getSavingThrows = (character, stats) => {
  stats = stats || getStats(character);
  return Array.from(Array(6).keys()).map(index => {
    const id = index + 1;
    return {
      type: ABILITIES[id].shortName,
      value: stats[id].savingThrow
    };
  });
};

export const getSenses = character => {
  const senses = ['blindsight', 'darkvision', 'tremorsense', 'truesight'];
  return runModifiers(
    character,
    [],
    ({ type, subType }) => type === 'set-base' && senses.includes(subType),
    (currentSenses, { value, friendlySubtypeName }) => {
      currentSenses.push(`${friendlySubtypeName} ${value} ft.`);
      return currentSenses;
    }
  );
};

const getProficiencyValue = (character, skillId) =>
  character.characterValues.find(
    value => String(value.valueId) === String(skillId) && value.typeId === 26
  );
const getSkillOverride = (character, skillId) =>
  character.characterValues.find(
    value => String(value.valueId) === String(skillId) && value.typeId === 23
  );
const getMagicBonus = (character, skillId) =>
  character.characterValues.find(
    value => String(value.valueId) === String(skillId) && value.typeId === 25
  );
const getMiscBonus = (character, skillId) =>
  character.characterValues.find(
    value => String(value.valueId) === String(skillId) && value.typeId === 24
  );
const getSkillStatOverride = (character, skillId) =>
  character.characterValues.find(
    value => String(value.valueId) === String(skillId) && value.typeId === 27
  );

const isProficiencyBetter = (existingProficiency, newProficiency) => {
  switch (existingProficiency) {
    case 'expertise':
      return false;
    case 'proficiency':
      if (newProficiency === 'expertise') return true;
      return false;
    case 'half-proficiency':
      if (newProficiency === 'expertise') return true;
      if (newProficiency === 'proficiency') return true;
      return false;
    case null:
      return true;
    default:
      return false;
  }
};

export const getSkills = (character, stats) => {
  stats = stats || getStats(character);
  const level = getLevel(character);
  const proficiencyBonus = getProficiencyBonus(level);

  const skills = Object.entries(SKILLS).reduce(
    (currentSkills, [id, { name, abilityId }]) => {
      const skill = {
        name,
        abilityId,
        proficiencyValue: 0,
        proficiency: null,
        proficientThroughAbilityCheck: false,
        proficiencyThroughCharacterValues: false
      };

      const proficiencyValue = getProficiencyValue(character, id);
      const skillOverride = getSkillOverride(character, id);
      const skillStatOverride = getSkillStatOverride(character, id);
      const magicBonus = getMagicBonus(character, id);
      const miscBonus = getMiscBonus(character, id);

      switch (proficiencyValue && proficiencyValue.value) {
        case 4:
          skill.proficiencyValue = proficiencyBonus * 2;
          skill.proficiency = 'expertise';
          skill.proficiencyThroughCharacterValues = true;
          break;
        case 3:
          skill.proficiencyValue = proficiencyBonus;
          skill.proficiency = 'proficiency';
          skill.proficiencyThroughCharacterValues = true;
          break;
        case 2:
          skill.proficiencyValue = Math.floor(proficiencyBonus / 2);
          skill.proficiency = 'half-proficiency';
          skill.proficiencyThroughCharacterValues = true;
          break;
      }

      skill.skillOverride = skillOverride ? skillOverride.value : null;
      skill.skillStatOverride = skillStatOverride
        ? skillStatOverride.value
        : null;
      skill.magicBonus = magicBonus ? magicBonus.value || 0 : 0;
      skill.miscBonus = miscBonus ? miscBonus.value || 0 : 0;

      const abilityModifierId = skill.skillStatOverride || abilityId;
      skill.modifier = stats[abilityModifierId].modifier;

      skill.total = Number.isInteger(skill.skillOverride)
        ? skill.skillOverride
        : skill.modifier +
          skill.magicBonus +
          skill.miscBonus +
          skill.proficiencyValue;

      currentSkills[id] = skill;
      return currentSkills;
    },
    {}
  );

  return runModifiers(
    character,
    skills,
    ({ type, subType }) =>
      ['half-proficiency', 'proficiency', 'expertise'].includes(type) &&
      (SKILLS_TYPES.includes(subType) || subType === 'ability-checks'),
    (currentSkills, { type, subType, entityId }) => {
      if (subType === 'ability-checks') {
        currentSkills = Object.entries(currentSkills).reduce(
          (current, [id, skill]) => {
            if (!skill.proficiency) {
              skill.proficiency = type;
              switch (type) {
                case 'expertise':
                  skill.proficiencyValue = proficiencyBonus * 2;
                  break;
                case 'proficiency':
                  skill.proficiencyValue = proficiencyBonus;
                  break;
                case 'half-proficiency':
                  skill.proficiencyValue = Math.floor(proficiencyBonus / 2);
                  break;
              }
              skill.proficientThroughAbilityCheck = true;

              skill.total = Number.isInteger(skill.skillOverride)
                ? skill.skillOverride
                : skill.modifier +
                  skill.magicBonus +
                  skill.miscBonus +
                  skill.proficiencyValue;

              current[id] = skill;
            }
            return current;
          },
          currentSkills
        );
      } else if (
        !currentSkills[entityId].proficiencyThroughCharacterValues &&
        isProficiencyBetter(currentSkills[entityId].proficiency, type)
      ) {
        const skill = currentSkills[entityId];
        skill.proficiency = type;
        switch (type) {
          case 'expertise':
            skill.proficiencyValue = proficiencyBonus * 2;
            break;
          case 'proficiency':
            skill.proficiencyValue = proficiencyBonus;
            break;
          case 'half-proficiency':
            skill.proficiencyValue = Math.floor(proficiencyBonus / 2);
            break;
        }
        skill.proficientThroughAbilityCheck = false;

        skill.total = Number.isInteger(skill.skillOverride)
          ? skill.skillOverride
          : skill.modifier +
            skill.magicBonus +
            skill.miscBonus +
            skill.proficiencyValue;

        currentSkills[entityId] = skill;
      }

      return currentSkills;
    }
  );
};

export const getPassiveSkills = (character, stats) => {
  const skills = getSkills(character, stats);

  let passiveSkills = [14, 8, 12].reduce((currentPassiveSkills, id) => {
    currentPassiveSkills[SKILLS[id].name.toLowerCase()] = {
      type: SKILLS[id].name,
      bonus: 0,
      value: 10 + skills[id].total
    };
    return currentPassiveSkills;
  }, {});

  passiveSkills = runModifiers(
    character,
    passiveSkills,
    ({ type, subType }) => type === 'bonus' && subType.includes('passive-'),
    (currentPassiveSkills, { subType, value }) => {
      const type = subType.match(/passive-(.*)/);
      if (!type || !type[1]) return currentPassiveSkills;

      const skillName = type[1];
      if (currentPassiveSkills[skillName])
        currentPassiveSkills[skillName].bonus += value;

      return currentPassiveSkills;
    }
  );

  return [
    passiveSkills[SKILLS[14].name.toLowerCase()],
    passiveSkills[SKILLS[8].name.toLowerCase()],
    passiveSkills[SKILLS[12].name.toLowerCase()]
  ];
};
