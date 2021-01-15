import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import styled from 'styled-components';

import Grid from 'styled-components-grid';
import {
  getArmorClass,
  getDcSaves,
  getHitPoints,
  getInitiative,
  getLevel,
  getPassiveSkills,
  getSavingThrows,
  getSenses,
  getSpeeds,
  getStats
} from '../../common/character-utils';
import {
  Block,
  CharacterInfo,
  CharacterInfoContainer,
  CharacterTopInfo,
  Distance,
  DistanceLabel,
  Footer,
  Header,
  HeaderBG,
  HeaderContainer,
  HeaderContent,
  InlineGroup,
  InlineItem,
  Label,
  LargeNumber,
  LargeSign,
  MainContainer,
  Portrait,
  PortraitContainer,
  RowContainer,
  Senses,
  StatsContainer,
  Value
} from './ui-elements';

const GridItem = styled(Grid.Unit)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const renderPlayer = character => {
  const campaignCharacter =
    character &&
    character.campaign &&
    character.campaign.characters &&
    character.campaign.characters.find(c => c.characterId === character.id);

  return (
    <CharacterInfo>
      {campaignCharacter
        ? `Player: ${campaignCharacter.username}`
        : 'Unassigned'}
    </CharacterInfo>
  );
};

const renderCharacterInfo = character => {
  const level = getLevel(character);
  const race = character.race.fullName;
  const classes = character.classes
    .map(classItem => {
      const subClass =
        classItem.subclassDefinition && classItem.subclassDefinition.name
          ? ` / ${classItem.subclassDefinition.name}`
          : '';
      return `${classItem.definition.name} ${classItem.level}${subClass}`;
    })
    .join(' / ');

  return (
    <CharacterInfo>
      Lvl {level} | {race} | {classes}
    </CharacterInfo>
  );
};

const renderInitiative = initiative => (
  <Block>
    <Value>
      <LargeNumber>
        <LargeSign>{initiative >= 0 ? '+' : '-'}</LargeSign>
        <span>{Math.abs(initiative)}</span>
      </LargeNumber>
    </Value>
    <Footer>
      <Label>Initiative</Label>
    </Footer>
  </Block>
);

const renderAC = ac => (
  <Block>
    <Header>
      <Label>Armor</Label>
    </Header>
    <Value>{ac.total}</Value>
    <Footer>
      <Label>Class</Label>
    </Footer>
  </Block>
);

const renderHP = hp => (
  <Block>
    <Value>
      <span>
        {hp.current} / {hp.max}
      </span>
    </Value>
    <Footer>
      <Label>Hit Points</Label>
    </Footer>
  </Block>
);

const renderSpeed = speed => (
  <InlineItem key={speed.type}>
    <Value>
      <Distance>
        <span>{speed.value}</span>
        <DistanceLabel>ft.</DistanceLabel>
      </Distance>
    </Value>
    <Footer>
      <Label>{speed.type}</Label>
    </Footer>
  </InlineItem>
);

const renderSpeeds = speeds => (
  <Block>
    <Header>
      <Label>Speed</Label>
    </Header>
    <InlineGroup>{speeds.map(renderSpeed)}</InlineGroup>
  </Block>
);

const renderDC = dc => (
  <InlineItem key={dc.type}>
    <Value>{dc.value}</Value>
    <Footer>
      <Label>{dc.type}</Label>
    </Footer>
  </InlineItem>
);

const renderDCs = dcs => (
  <Block>
    <Header>
      <Label>Save DC</Label>
    </Header>
    <InlineGroup>{dcs.map(renderDC)}</InlineGroup>
  </Block>
);

const renderSavingThrow = savingThrow => (
  <GridItem size={1 / 6}>
    <Block>
      <Value>
        <LargeNumber>
          <LargeSign>{savingThrow.value >= 0 ? '+' : '-'}</LargeSign>
          <span>{Math.abs(savingThrow.value)}</span>
        </LargeNumber>
      </Value>
      <Footer>
        <Label>{savingThrow.type}</Label>
      </Footer>
    </Block>
  </GridItem>
);

const renderSavingThrows = savingThrows => (
  <>
    <Block>
      <Header>
        <Label>Saving Throws</Label>
      </Header>
    </Block>
    <Grid verticalAlign={'center'}>{savingThrows.map(renderSavingThrow)}</Grid>
  </>
);

const renderSkill = skill => (
  <GridItem size={1 / 3}>
    <Block>
      <Value>{skill.value + skill.bonus}</Value>
      <Footer>
        <Label>{skill.type}</Label>
      </Footer>
    </Block>
  </GridItem>
);

const renderSkills = (skills, senses) => (
  <>
    <Block>
      <Header>
        <Label>Passive Skills</Label>
      </Header>
    </Block>
    <Grid verticalAlign={'center'}>{skills.map(renderSkill)}</Grid>
    <Senses>{senses.map(renderSense)}</Senses>
  </>
);

const renderSense = sense => <span>{sense} </span>;

const Character = ({ character }) => {
  const stats = getStats(character);
  const initiative = getInitiative(character, stats);
  const ac = getArmorClass(character, stats);
  const hp = getHitPoints(character, stats);
  const speeds = getSpeeds(character, stats, ac);
  const dcs = getDcSaves(character);
  const savingThrows = getSavingThrows(character, stats);
  const passiveSkills = getPassiveSkills(character, stats);
  const senses = getSenses(character);

  return (
    <MainContainer>
      <HeaderContainer>
        <HeaderBG
          bgImage={character.defaultBackdrop.thumbnailBackdropAvatarUrl}
        />
        <HeaderContent>
          <PortraitContainer>
            <Portrait src={character.avatarUrl || 'assets/d20.png'} />
          </PortraitContainer>
          <CharacterInfoContainer>
            <CharacterTopInfo>{character.name}</CharacterTopInfo>
            {renderCharacterInfo(character)}
            {renderPlayer(character)}
          </CharacterInfoContainer>
        </HeaderContent>
      </HeaderContainer>
      <StatsContainer>
        <RowContainer>
          <Grid verticalAlign={'center'}>
            <GridItem size={1 / 3}>{renderInitiative(initiative)}</GridItem>
            <GridItem size={1 / 3}>{renderAC(ac)}</GridItem>
            <GridItem size={1 / 3}>{renderHP(hp)}</GridItem>
          </Grid>
        </RowContainer>
        <RowContainer>
          <Grid verticalAlign={'center'}>
            <GridItem size={1 / 2}>{renderSpeeds(speeds)}</GridItem>
            <GridItem size={1 / 2}>{renderDCs(dcs)}</GridItem>
          </Grid>
        </RowContainer>
        <RowContainer>{renderSavingThrows(savingThrows)}</RowContainer>
        <RowContainer>{renderSkills(passiveSkills, senses)}</RowContainer>
      </StatsContainer>
    </MainContainer>
  );
};

export default Character;
