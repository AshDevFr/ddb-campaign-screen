const API_CHARACTER_ENDPOINT =
  'https://character-service.dndbeyond.com/character/v3/character';

const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const {
  getArmorClass,
  getInitiative,
  getHitPoints,
  getStats,
  getSpeeds,
  getDcSaves,
  getSavingThrows,
  getSkills,
  getPassiveSkills,
  getSenses
} = require('../dist_utils/utils');

async function getCharacter(id, callback) {
  const {data} = await axios.get(`${API_CHARACTER_ENDPOINT}/${id}`, {
    headers: {
      'User-Agent':
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/70.0'
    }
  });
  callback(data.data);
}

function process_file(file) {
  const rawdata = fs.readFileSync(file);
  character = JSON.parse(rawdata);
  process(character);
}

function process(character) {
  const stats = getStats(character);
  const initiative = getInitiative(character, stats);
  const hp = getHitPoints(character, stats);
  const ac = getArmorClass(character, stats);
  const speed = getSpeeds(character, stats, ac);
  const dcSaves = getDcSaves(character);
  const savingThrows = getSavingThrows(character, stats);
  const skills = getSkills(character, stats);
  const passiveSkills = getPassiveSkills(character, stats);
  const senses = getSenses(character);

  const charStats = {
    stats,
    initiative,
    hp: `${hp.current} / ${hp.max}`,
    ac,
    speed,
    dcSaves,
    savingThrows,
    skills,
    passiveSkills,
    senses
  };

  console.log(charStats);
}

const argv = yargs
  .option('force', {
    description: 'force download',
    type: 'bool'
  })
  .option('file', {
    description: 'file',
    alias: 'f',
    type: 'string'
  })
  .option('char', {
    description: 'id',
    alias: 'c',
    type: 'string'
  })
  .help()
  .alias('help', 'h').argv;

let character;
if (argv.file) {
  process_file(file);
} else if (argv.char) {
  const file = `./data/characters/${argv.char}.json`;
  if (!argv.force && fs.existsSync(file)) {
    process_file(file);
  } else {
    getCharacter(argv.char, character => {
      const data = JSON.stringify(character);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, data);
      process_file(file);
    });
  }
}
