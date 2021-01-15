import { h } from 'preact';
import styled, { ThemeProvider } from 'styled-components';
import Grid from 'styled-components-grid';
import Character from './character';
import { useSelector } from 'react-redux';

const theme = {
  breakpoints: {
    xs: 0,
    sm: 800,
    md: 1150,
    lg: 1500,
    xl: 1850
  }
};

const GridItem = styled(Grid.Unit)`
  padding: 5px 0;
`;

const CharacterList = ({ characters }) => {
  const { characterIds } = useSelector(state => state.options);
  const ids = characterIds.map(({ id }) => id);

  const renderCharacter = character => (
    <ThemeProvider theme={theme}>
      <GridItem size={{ xs: 1, sm: 1 / 2, md: 1 / 3, lg: 1 / 4, xl: 1 / 5 }}>
        <Character character={character} key={character.id} />
      </GridItem>
    </ThemeProvider>
  );

  const renderCharacters = characters =>
    Object.values(characters)
      .filter(character => ids.includes(String(character.id)))
      .map(renderCharacter);

  return <Grid>{renderCharacters(characters)}</Grid>;
};

export default CharacterList;
